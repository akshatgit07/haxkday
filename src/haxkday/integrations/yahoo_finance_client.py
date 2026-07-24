"""Wraps Yahoo Finance for free-tier price/quote data used by the Market Analyst."""

from ..models.schemas import MarketSnapshot


class YahooFinanceClient:
    async def get_snapshot(self, ticker: str) -> MarketSnapshot:
        """Fetch current price, market cap, and headline news for a ticker."""
        raise NotImplementedError
