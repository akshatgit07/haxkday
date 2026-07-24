from ..models.schemas import FinancialSnapshot, ValuationResult
from .base import Agent


class ValuationAgent(Agent):
    """Runs DCF, PE, EV/EBITDA, PEG, and comparable-company analysis inside the Daytona sandbox."""

    name = "valuation_analyst"

    async def run(self, financials: FinancialSnapshot) -> ValuationResult:
        raise NotImplementedError
