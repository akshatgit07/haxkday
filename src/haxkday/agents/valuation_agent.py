import asyncio
import inspect
import json

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

        code = _build_dcf_snippet(projected_fcfs, _DEFAULT_DISCOUNT_RATE, _DEFAULT_TERMINAL_GROWTH_RATE)
        raw = await asyncio.to_thread(self.daytona.run_code, code)
        fair_value = json.loads(raw)["dcf_fair_value"]

        return ValuationResult(dcf_fair_value=fair_value)


def _build_dcf_snippet(free_cash_flows: list[float], discount_rate: float, terminal_growth_rate: float) -> str:
    source = inspect.getsource(financial_models.dcf_fair_value)
    return (
        f"{source}\n"
        "import json\n"
        f"result = dcf_fair_value({free_cash_flows!r}, {discount_rate!r}, {terminal_growth_rate!r})\n"
        "print(json.dumps({'dcf_fair_value': result}))\n"
    )
