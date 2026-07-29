import httpx
from fastapi import APIRouter

from ...agents.memo_agent import InvestmentMemoAgent
from ...agents.planner import PlannerAgent
from ...agents.research_agent import ResearchAgent
from ...agents.valuation_agent import ValuationAgent
from ...config import get_settings
from ...integrations.alpha_vantage_client import AlphaVantageClient
from ...integrations.braintrust_client import BraintrustClient
from ...integrations.daytona_client import DaytonaSandboxClient
from ...integrations.fireworks_client import FireworksClient
from ...integrations.sec_edgar_client import SecEdgarClient
from ...models.schemas import AnalysisRequest, FilingExcerpt, InvestmentMemo, ValuationResult

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=InvestmentMemo)
async def analyze(request: AnalysisRequest) -> InvestmentMemo:
    """Run the pipeline for a request, tracing every step to Braintrust.

    Research pulls real 10-K/10-Q filings from SEC EDGAR, and Valuation runs a
    real DCF (inside Daytona) on fundamentals pulled from Alpha Vantage, when a
    ticker is given. Market/Risk agents aren't wired to live data sources yet
    (Polygon/FMP keys still missing), so those fields stay null.
    """
    settings = get_settings()
    braintrust = BraintrustClient(api_key=settings.braintrust_api_key, project=settings.braintrust_project)
    trace_id = braintrust.start_trace("analyze")

    try:
        fireworks = FireworksClient(api_key=settings.fireworks_api_key, model=settings.fireworks_model)

        planner = PlannerAgent(fireworks)
        tasks = await planner.run(request.query)
        braintrust.log_span(trace_id, name="planner", input={"query": request.query}, output={"tasks": tasks})

        filings: list[FilingExcerpt] = []
        valuation: ValuationResult | None = None
        if request.ticker:
            research = ResearchAgent(SecEdgarClient(user_agent=settings.sec_edgar_user_agent))
            filings = await research.run(request.ticker)
            braintrust.log_span(
                trace_id,
                name="research",
                input={"ticker": request.ticker},
                output={"filing_types": [f.filing_type for f in filings]},
            )

            valuation_agent = ValuationAgent(
                AlphaVantageClient(api_key=settings.alpha_vantage_api_key),
                DaytonaSandboxClient(api_key=settings.daytona_api_key),
            )
            try:
                valuation = await valuation_agent.run(request.ticker)
            except (httpx.HTTPError, ValueError, RuntimeError) as exc:
                # Data source unavailable/rate-limited/unknown ticker — proceed without it.
                braintrust.log_span(
                    trace_id, name="valuation", input={"ticker": request.ticker}, output={"error": str(exc)}
                )
            else:
                braintrust.log_span(
                    trace_id, name="valuation", input={"ticker": request.ticker}, output=valuation.model_dump()
                )

        ticker = request.ticker or request.company_name or request.query
        memo_agent = InvestmentMemoAgent(fireworks)
        memo = await memo_agent.run(ticker=ticker, filings=filings, valuation=valuation)
        braintrust.log_span(trace_id, name="memo", input={"ticker": ticker}, output=memo.model_dump())

        braintrust.score(trace_id, confidence=memo.confidence_pct / 100)
        return memo
    except Exception:
        braintrust.score(trace_id, confidence=0.0)
        raise
