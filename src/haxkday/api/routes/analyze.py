from fastapi import APIRouter, HTTPException

from ...config import get_settings
from ...models.schemas import AnalysisRequest, InvestmentMemo
from ...pipeline import run_analysis
from ...integrations.fireworks_client import FireworksError

router = APIRouter(prefix="/analyze", tags=["analyze"])


@router.post("", response_model=InvestmentMemo)
async def analyze(request: AnalysisRequest) -> InvestmentMemo:
    """Run the full analysis pipeline. See pipeline.run_analysis for details."""
    try:
        return await run_analysis(request, get_settings())
    except FireworksError as exc:
        # Keep vendor details useful for operators without leaking the API key.
        raise HTTPException(status_code=502, detail=str(exc)) from exc
