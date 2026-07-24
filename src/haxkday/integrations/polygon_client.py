"""Wraps Polygon.io for real-time/historical market data used by the Market Analyst."""


class PolygonClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    async def get_aggregates(self, ticker: str, timespan: str, lookback_days: int) -> list[dict]:
        """Fetch historical price bars for a ticker."""
        raise NotImplementedError
