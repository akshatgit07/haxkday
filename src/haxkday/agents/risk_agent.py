from ..models.schemas import FinancialSnapshot, RiskAssessment
from .base import Agent


class RiskAgent(Agent):
    """Analyzes debt, liquidity, cash flow, margins, credit risk, and competition."""

    name = "risk_analyst"

    async def run(self, financials: FinancialSnapshot) -> RiskAssessment:
        raise NotImplementedError
