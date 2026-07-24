from fastapi import APIRouter

from ...models.schemas import AnalysisRequest, InvestmentMemo

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=InvestmentMemo)
async def analyze(request: AnalysisRequest) -> InvestmentMemo:
    """Run the full Planner -> Research/Market -> Valuation/Risk -> Memo pipeline."""
    raise NotImplementedError
