from fastapi import APIRouter

from ...agents.memo_agent import InvestmentMemoAgent
from ...agents.planner import PlannerAgent
from ...agents.research_agent import ResearchAgent
from ...config import get_settings
from ...integrations.fireworks_client import FireworksClient
from ...integrations.sec_edgar_client import SecEdgarClient
from ...models.schemas import AnalysisRequest, FilingExcerpt, InvestmentMemo

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=InvestmentMemo)
async def analyze(request: AnalysisRequest) -> InvestmentMemo:
    """Run the pipeline for a request.

    Research now pulls real 10-K/10-Q filings from SEC EDGAR when a ticker is
    given. Market/Valuation/Risk agents aren't wired to live data sources yet
    (Alpha Vantage/Polygon/FMP keys still missing), so those fields stay null
    and the memo leans on the model's own reasoning to fill the gaps.
    """
    settings = get_settings()
    fireworks = FireworksClient(api_key=settings.fireworks_api_key, model=settings.fireworks_model)

    planner = PlannerAgent(fireworks)
    await planner.run(request.query)

    filings: list[FilingExcerpt] = []
    if request.ticker:
        research = ResearchAgent(SecEdgarClient(user_agent=settings.sec_edgar_user_agent))
        filings = await research.run(request.ticker)

    ticker = request.ticker or request.company_name or request.query
    memo_agent = InvestmentMemoAgent(fireworks)
    return await memo_agent.run(ticker=ticker, filings=filings)
