import json

from ..integrations.fireworks_client import FireworksClient
from ..models.schemas import (
    FilingExcerpt,
    InvestmentMemo,
    MarketSnapshot,
    RiskAssessment,
    ValuationResult,
)
from ..utils import strip_json_fence
from .base import Agent

_SYSTEM_PROMPT = (
    "You are the Investment Memo Agent for an autonomous financial analyst. "
    "Given a ticker and whatever research/market/valuation/risk data is "
    "available (fields may be null if a data source isn't wired up yet), "
    "produce an investment memo. Respond with a single JSON object matching "
    'exactly this schema: {"ticker": str, "executive_summary": str, '
    '"bull_case": [str], "bear_case": [str], "key_risks": [str], '
    '"recommendation": "BUY" | "HOLD" | "SELL", "confidence_pct": float}. '
    "Respond with JSON only — no markdown fences, no commentary."
)


class InvestmentMemoAgent(Agent):
    """Produces the executive summary, bull case, bear case, key risks, and recommendation."""

    name = "investment_memo"

    def __init__(self, fireworks: FireworksClient) -> None:
        self.fireworks = fireworks

    async def run(
        self,
        ticker: str,
        filings: list[FilingExcerpt],
        market: MarketSnapshot | None = None,
        valuation: ValuationResult | None = None,
        risk: RiskAssessment | None = None,
    ) -> InvestmentMemo:
        user_prompt = json.dumps(
            {
                "ticker": ticker,
                "filings": [f.model_dump() for f in filings],
                "market": market.model_dump() if market else None,
                "valuation": valuation.model_dump() if valuation else None,
                "risk": risk.model_dump() if risk else None,
            }
        )
        raw = await self.fireworks.complete(_SYSTEM_PROMPT, user_prompt)
        return InvestmentMemo.model_validate_json(strip_json_fence(raw))
