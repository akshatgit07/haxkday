"""Wraps Alpha Vantage for fundamentals and economic indicator data."""


class AlphaVantageClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    async def get_company_overview(self, ticker: str) -> dict:
        """Fetch fundamental company overview data (margins, ratios, etc.)."""
        raise NotImplementedError
