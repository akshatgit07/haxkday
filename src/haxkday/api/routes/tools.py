from fastapi import APIRouter, Header, HTTPException

from ...config import get_settings
from ...models.schemas import AnalysisRequest
from ...pipeline import run_analysis

router = APIRouter(prefix="/tools", tags=["tools"])


@router.post("/analyze")
async def analyze_tool(
    request: AnalysisRequest,
    x_webhook_secret: str | None = Header(default=None, alias="X-Webhook-Secret"),
) -> dict:
    """Server-tool webhook for the ElevenLabs Conversational AI voice agent.

    Configure this as a "Server tool" on the agent (its small dispatcher model
    decides when to call it mid-conversation), pointed at this URL, with a
    static request header `X-Webhook-Secret: <ELEVENLABS_WEBHOOK_SECRET>` so
    only the agent — not the open internet — can trigger a run. `request`'s
    fields (query/ticker/company_name) should match the tool's parameter
    schema configured on the agent.

    Returns a `summary` string meant to be spoken back to the user, plus the
    full structured `memo` for logging/debugging.
    """
    settings = get_settings()
    if not settings.elevenlabs_webhook_secret or x_webhook_secret != settings.elevenlabs_webhook_secret:
        raise HTTPException(status_code=401, detail="Invalid or missing webhook secret")

    memo = await run_analysis(request, settings)
    summary = (
        f"{memo.ticker}: {memo.recommendation} recommendation, "
        f"{memo.confidence_pct:.0f} percent confidence. {memo.executive_summary}"
    )
    return {"summary": summary, "memo": memo.model_dump()}
