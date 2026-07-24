from fastapi import APIRouter

from ...agents.memo_agent import InvestmentMemoAgent
from ...agents.planner import PlannerAgent
from ...config import get_settings
from ...integrations.fireworks_client import FireworksClient
from ...models.schemas import AnalysisRequest, InvestmentMemo

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=InvestmentMemo)
async def analyze(request: AnalysisRequest) -> InvestmentMemo:
    """Run the pipeline for a request.

    Research/Market/Valuation/Risk agents aren't wired to live data sources
    yet (SEC EDGAR/Alpha Vantage/Polygon/FMP keys still missing), so the
    memo is generated from the Planner's task breakdown and the model's own
    reasoning rather than fresh filings or market data.
    """
    settings = get_settings()
    fireworks = FireworksClient(api_key=settings.fireworks_api_key, model=settings.fireworks_model)

    planner = PlannerAgent(fireworks)
    await planner.run(request.query)

    ticker = request.ticker or request.company_name or request.query
    memo_agent = InvestmentMemoAgent(fireworks)
    return await memo_agent.run(ticker=ticker, filings=[])
