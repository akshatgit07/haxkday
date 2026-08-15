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

_MAX_FILING_CHARS = 12_000
_LOW_CONFIDENCE_THRESHOLD = 60.0

_SYSTEM_PROMPT = (
    "You are the Investment Memo Agent for an autonomous financial analyst. "
    "Given a ticker and whatever research/market/valuation/risk data is "
    "available (fields may be null if a data source isn't wired up yet), "
    "produce an investment memo.\n\n"
    "Voice and tone: professional, calm, authoritative, concise. No "
    "conversational filler, no hedging throat-clearing. Every field is read "
    "aloud by a voice agent, so write for the ear as much as the eye.\n\n"
    "Delivery: executive_summary must lead with the single most important "
    "metric or variance in its first sentence — the number a managing "
    "director needs first — before any context or explanation.\n\n"
    "Number handling: write large sums in words the way you'd say them "
    "aloud (\"four point two billion dollars\", not \"$4.2B\" or "
    "digit-by-digit). Keep bull_case, bear_case, and key_risks to at most "
    "three items each — a voice agent can't usefully read a long list.\n\n"
    "Sourcing: you're given available_sources (filings actually retrieved) "
    "and known_data_gaps (data that could not be retrieved). When you draw "
    "on a filing, cite it by name in executive_summary the way a real "
    "analyst would (\"According to the Q2 10-Q...\"). Never imply you have "
    "data you weren't given — if valuation, market, or risk data is null, "
    "say so plainly rather than guessing.\n\n"
    "Continuity: if conversation_context includes a prior analysis of this "
    "same ticker for this user, reference it only when the view has clearly "
    "changed (\"this raises confidence from the prior hold\") — never "
    "reference prior analysis that wasn't given, and never treat it as a "
    "reason to omit current sourcing.\n\n"
    'Respond with a single JSON object matching exactly this schema: '
    '{"ticker": str, "executive_summary": str, "bull_case": [str], '
    '"bear_case": [str], "key_risks": [str], '
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
        context: str = "",
        web_research: list[dict[str, str]] | None = None,
    ) -> InvestmentMemo:
        sources = [f"SEC {f.filing_type}, fiscal period {f.fiscal_period}" for f in filings]
        web_research = web_research or []
        sources.extend(f"Web: {item['title']} ({item['url']})" for item in web_research if item.get("url"))
        data_gaps = _data_gaps(filings, market, valuation, risk)

        user_prompt = json.dumps(
            {
                "ticker": ticker,
                "filings": [_truncate_filing(f) for f in filings],
                "market": market.model_dump() if market else None,
                "valuation": valuation.model_dump() if valuation else None,
                "risk": risk.model_dump() if risk else None,
                "available_sources": sources,
                "known_data_gaps": data_gaps,
                "current_web_research": web_research,
                "conversation_context": context or None,
            }
        )
        raw = await self.fireworks.complete(_SYSTEM_PROMPT, user_prompt)
        memo = InvestmentMemo.model_validate_json(strip_json_fence(raw))

        if memo.confidence_pct < _LOW_CONFIDENCE_THRESHOLD:
            data_gaps = [*data_gaps, "Low-confidence estimate"]

        # sources/data_gaps are computed here, deterministically, from what
        # actually went into the request — never trust the model to
        # self-report what it was and wasn't given.
        return memo.model_copy(update={"sources": sources, "data_gaps": data_gaps})


def _data_gaps(
    filings: list[FilingExcerpt],
    market: MarketSnapshot | None,
    valuation: ValuationResult | None,
    risk: RiskAssessment | None,
) -> list[str]:
    gaps = []
    if not filings:
        gaps.append("No SEC filings on file for this company")
    if valuation is None or valuation.dcf_fair_value is None:
        gaps.append("Valuation data unavailable")
    if market is None:
        gaps.append("Live market data unavailable")
    if risk is None:
        gaps.append("Risk assessment not available")
    return gaps


def _truncate_filing(filing: FilingExcerpt) -> dict:
    data = filing.model_dump()
    data["text"] = data["text"][:_MAX_FILING_CHARS]
    return data
