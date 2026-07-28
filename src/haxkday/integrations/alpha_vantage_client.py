"""Wraps Alpha Vantage for fundamentals and economic indicator data."""

import httpx

from ..models.schemas import FinancialSnapshot

_BASE_URL = "https://www.alphavantage.co/query"


class AlphaVantageClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    async def _get(self, client: httpx.AsyncClient, function: str, ticker: str) -> dict:
        response = await client.get(
            _BASE_URL, params={"function": function, "symbol": ticker, "apikey": self.api_key}
        )
        response.raise_for_status()
        data = response.json()
        if "Error Message" in data or "Note" in data or "Information" in data:
            raise ValueError(f"Alpha Vantage error for {ticker} ({function}): {data}")
        return data

    async def get_company_overview(self, ticker: str) -> dict:
        """Fetch fundamental company overview data (margins, ratios, etc.)."""
        async with httpx.AsyncClient(timeout=30) as client:
            return await self._get(client, "OVERVIEW", ticker)

    async def get_financial_snapshot(self, ticker: str) -> FinancialSnapshot:
        """Assemble a FinancialSnapshot from the OVERVIEW, CASH_FLOW, and BALANCE_SHEET endpoints."""
        async with httpx.AsyncClient(timeout=30) as client:
            overview = await self._get(client, "OVERVIEW", ticker)
            cash_flow = await self._get(client, "CASH_FLOW", ticker)
            balance_sheet = await self._get(client, "BALANCE_SHEET", ticker)

        latest_cash_flow = (cash_flow.get("annualReports") or [{}])[0]
        latest_balance_sheet = (balance_sheet.get("annualReports") or [{}])[0]

        operating_cash_flow = _to_float(latest_cash_flow.get("operatingCashflow"))
        capital_expenditures = _to_float(latest_cash_flow.get("capitalExpenditures"))
        free_cash_flow = (
            operating_cash_flow - capital_expenditures
            if operating_cash_flow is not None and capital_expenditures is not None
            else None
        )

        return FinancialSnapshot(
            ticker=ticker,
            revenue_growth_pct=_to_pct(overview.get("QuarterlyRevenueGrowthYOY")),
            gross_margin_pct=_gross_margin_pct(overview),
            operating_margin_pct=_to_pct(overview.get("OperatingMarginTTM")),
            cash_position=_to_float(latest_balance_sheet.get("cashAndCashEquivalentsAtCarryingValue")),
            total_debt=_to_float(latest_balance_sheet.get("shortLongTermDebtTotal")),
            free_cash_flow=free_cash_flow,
        )


def _to_float(value: str | None) -> float | None:
    if value is None:
        return None
    try:
        return float(value)
    except ValueError:
        return None  # Alpha Vantage uses the literal string "None" for missing fields.


def _to_pct(value: str | None) -> float | None:
    fraction = _to_float(value)
    return fraction * 100 if fraction is not None else None


def _gross_margin_pct(overview: dict) -> float | None:
    revenue = _to_float(overview.get("RevenueTTM"))
    gross_profit = _to_float(overview.get("GrossProfitTTM"))
    if not revenue or gross_profit is None:
        return None
    return gross_profit / revenue * 100
