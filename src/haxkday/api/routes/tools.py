import asyncio

from fastapi import APIRouter, Header, HTTPException

from ...config import Settings, get_settings
from ...integrations.daytona_client import DaytonaSandboxClient
from ...models.schemas import AnalysisRequest, ScenarioRequest
from ...pipeline import run_analysis
from ...sandbox import financial_models

router = APIRouter(prefix="/tools", tags=["tools"])


def _require_webhook_secret(settings: Settings, x_webhook_secret: str | None) -> None:
    if not settings.elevenlabs_webhook_secret or x_webhook_secret != settings.elevenlabs_webhook_secret:
        raise HTTPException(status_code=401, detail="Invalid or missing webhook secret")


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
    _require_webhook_secret(settings, x_webhook_secret)

    memo = await run_analysis(request, settings)
    summary = (
        f"{memo.ticker}: {memo.recommendation} recommendation, "
        f"{memo.confidence_pct:.0f} percent confidence. {memo.executive_summary}"
    )
    if memo.sources:
        summary += f" Source: {', '.join(memo.sources)}."
    if memo.data_gaps:
        summary += f" Note: {', '.join(memo.data_gaps)}."
    return {"summary": summary, "memo": memo.model_dump()}


@router.post("/scenario")
async def scenario_tool(
    request: ScenarioRequest,
    x_webhook_secret: str | None = Header(default=None, alias="X-Webhook-Secret"),
) -> dict:
    """Server-tool webhook for quick scenario modeling, e.g. "what happens to margin
    if logistics costs rise 8%?". Runs the calculation for real inside Daytona.

    Same shared-secret guard as /tools/analyze. `cost_category_pct_change` is a
    fraction (0.08 for +8%, -0.05 for -5%).
    """
    settings = get_settings()
    _require_webhook_secret(settings, x_webhook_secret)

    daytona = DaytonaSandboxClient(api_key=settings.daytona_api_key)
    result = await asyncio.to_thread(
        daytona.run_function,
        financial_models.margin_scenario,
        request.revenue,
        request.total_costs,
        request.cost_category_amount,
        request.cost_category_pct_change,
    )

    direction = "increases" if request.cost_category_pct_change >= 0 else "decreases"
    pct = abs(request.cost_category_pct_change) * 100
    trend = "a decline" if result["margin_delta_pct"] < 0 else "an improvement"
    summary = (
        f"If {request.cost_category_label} {direction} {pct:.0f} percent, net margin moves from "
        f"{result['base_margin_pct']:.1f} percent to {result['new_margin_pct']:.1f} percent — "
        f"{trend} of {abs(result['margin_delta_pct']):.1f} points."
    )
    return {"summary": summary, "result": result}
