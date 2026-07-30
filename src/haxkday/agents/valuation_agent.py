import asyncio

from ..integrations.alpha_vantage_client import AlphaVantageClient
from ..integrations.daytona_client import DaytonaSandboxClient
from ..models.schemas import FinancialSnapshot, ValuationResult
from ..sandbox import financial_models
from .base import Agent

_DEFAULT_GROWTH_RATE = 0.05
_DEFAULT_DISCOUNT_RATE = 0.10
_DEFAULT_TERMINAL_GROWTH_RATE = 0.025
_PROJECTION_YEARS = 5


class ValuationAgent(Agent):
    """Runs DCF valuation inside the Daytona sandbox, on fundamentals pulled from Alpha
    Vantage. PE, EV/EBITDA, PEG, and comparable-company analysis aren't wired up yet —
    they need price/EPS/EBITDA data this pipeline doesn't have a source for."""

    name = "valuation_analyst"

    def __init__(self, alpha_vantage: AlphaVantageClient, daytona: DaytonaSandboxClient) -> None:
        self.alpha_vantage = alpha_vantage
        self.daytona = daytona

    async def run(self, ticker: str) -> ValuationResult:
        financials = await self.alpha_vantage.get_financial_snapshot(ticker)
        return await self._run_dcf(financials)

    async def _run_dcf(self, financials: FinancialSnapshot) -> ValuationResult:
        if financials.free_cash_flow is None:
            return ValuationResult()

        growth_rate = (financials.revenue_growth_pct or _DEFAULT_GROWTH_RATE * 100) / 100
        projected_fcfs = [
            financials.free_cash_flow * (1 + growth_rate) ** year for year in range(1, _PROJECTION_YEARS + 1)
        ]

        fair_value = await asyncio.to_thread(
            self.daytona.run_function,
            financial_models.dcf_fair_value,
            projected_fcfs,
            _DEFAULT_DISCOUNT_RATE,
            _DEFAULT_TERMINAL_GROWTH_RATE,
        )
        return ValuationResult(dcf_fair_value=fair_value)
