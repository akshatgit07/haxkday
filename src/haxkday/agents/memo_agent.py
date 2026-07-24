from ..models.schemas import (
    FilingExcerpt,
    InvestmentMemo,
    MarketSnapshot,
    RiskAssessment,
    ValuationResult,
)
from .base import Agent


class InvestmentMemoAgent(Agent):
    """Produces the executive summary, bull case, bear case, key risks, and recommendation."""

    name = "investment_memo"

    async def run(
        self,
        ticker: str,
        filings: list[FilingExcerpt],
        market: MarketSnapshot,
        valuation: ValuationResult,
        risk: RiskAssessment,
    ) -> InvestmentMemo:
        raise NotImplementedError
