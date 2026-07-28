import httpx
from fastapi import APIRouter

from ...agents.memo_agent import InvestmentMemoAgent
from ...agents.planner import PlannerAgent
from ...agents.research_agent import ResearchAgent
from ...agents.valuation_agent import ValuationAgent
from ...config import get_settings
from ...integrations.alpha_vantage_client import AlphaVantageClient
from ...integrations.daytona_client import DaytonaSandboxClient
from ...integrations.fireworks_client import FireworksClient
from ...integrations.sec_edgar_client import SecEdgarClient
from ...models.schemas import AnalysisRequest, FilingExcerpt, InvestmentMemo, ValuationResult

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=InvestmentMemo)
async def analyze(request: AnalysisRequest) -> InvestmentMemo:
    """Run the pipeline for a request.

    Research pulls real 10-K/10-Q filings from SEC EDGAR, and Valuation runs a
    real DCF (inside Daytona) on fundamentals pulled from Alpha Vantage, when a
    ticker is given. Market/Risk agents aren't wired to live data sources yet
    (Polygon/FMP keys still missing), so those fields stay null.
    """
    settings = get_settings()
    fireworks = FireworksClient(api_key=settings.fireworks_api_key, model=settings.fireworks_model)

    planner = PlannerAgent(fireworks)
    await planner.run(request.query)

    filings: list[FilingExcerpt] = []
    valuation: ValuationResult | None = None
    if request.ticker:
        research = ResearchAgent(SecEdgarClient(user_agent=settings.sec_edgar_user_agent))
        filings = await research.run(request.ticker)

        valuation_agent = ValuationAgent(
            AlphaVantageClient(api_key=settings.alpha_vantage_api_key),
            DaytonaSandboxClient(api_key=settings.daytona_api_key),
        )
        try:
            valuation = await valuation_agent.run(request.ticker)
        except (httpx.HTTPError, ValueError, RuntimeError):
            valuation = None  # Data source unavailable/rate-limited/unknown ticker — proceed without it.

    ticker = request.ticker or request.company_name or request.query
    memo_agent = InvestmentMemoAgent(fireworks)
    return await memo_agent.run(ticker=ticker, filings=filings, valuation=valuation)
