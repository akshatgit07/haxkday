"""Wraps the Financial Modeling Prep API for financial statements and ratios."""

from ..models.schemas import FinancialSnapshot


class FmpClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    async def get_financial_snapshot(self, ticker: str) -> FinancialSnapshot:
        """Fetch income statement / balance sheet / cash flow derived metrics for a ticker."""
        raise NotImplementedError
