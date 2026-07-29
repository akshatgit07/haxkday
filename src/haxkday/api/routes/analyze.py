from fastapi import APIRouter

from ...config import get_settings
from ...models.schemas import AnalysisRequest, InvestmentMemo
from ...pipeline import run_analysis

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=InvestmentMemo)
async def analyze(request: AnalysisRequest) -> InvestmentMemo:
    """Run the full analysis pipeline. See pipeline.run_analysis for details."""
    return await run_analysis(request, get_settings())
