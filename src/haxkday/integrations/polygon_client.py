"""Wraps Polygon.io for real-time/historical market data used by the Market Analyst."""

from datetime import date, timedelta

import httpx

from ..models.schemas import MarketSnapshot

_BASE_URL = "https://api.polygon.io"


class PolygonClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    async def get_aggregates(self, ticker: str, timespan: str, lookback_days: int) -> list[dict]:
        """Fetch historical price bars for a ticker."""
        end = date.today()
        start = end - timedelta(days=lookback_days)
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{_BASE_URL}/v2/aggs/ticker/{ticker}/range/1/{timespan}/{start.isoformat()}/{end.isoformat()}",
                params={"apiKey": self.api_key, "sort": "asc"},
            )
            response.raise_for_status()
            data = response.json()
            if data.get("status") not in ("OK", "DELAYED"):
                raise ValueError(f"Polygon error for {ticker}: {data}")
            return data.get("results", [])

    async def get_market_snapshot(self, ticker: str) -> MarketSnapshot:
        """Fetch current price, market cap, and recent headlines for a ticker."""
        async with httpx.AsyncClient(timeout=30) as client:
            snapshot_response = await client.get(
                f"{_BASE_URL}/v2/snapshot/locale/us/markets/stocks/tickers/{ticker}",
                params={"apiKey": self.api_key},
            )
            snapshot_response.raise_for_status()
            snapshot_data = snapshot_response.json()
            if snapshot_data.get("status") not in ("OK", "DELAYED"):
                raise ValueError(f"Polygon error for {ticker}: {snapshot_data}")
            ticker_data = snapshot_data["ticker"]
            price = (ticker_data.get("day") or {}).get("c") or (ticker_data.get("lastTrade") or {}).get("p")
            if price is None:
                raise ValueError(f"Polygon returned no price for {ticker}")

            details_response = await client.get(
                f"{_BASE_URL}/v3/reference/tickers/{ticker}",
                params={"apiKey": self.api_key},
            )
            details_response.raise_for_status()
            market_cap = details_response.json().get("results", {}).get("market_cap")

            news_response = await client.get(
                f"{_BASE_URL}/v2/reference/news",
                params={"ticker": ticker, "limit": 5, "apiKey": self.api_key},
            )
            news_response.raise_for_status()
            headlines = [item["title"] for item in news_response.json().get("results", [])]

            day_change_pct = ticker_data.get("todaysChangePerc")

        try:
            bars = await self.get_aggregates(ticker, "day", 30)
            price_history = [bar["c"] for bar in bars if "c" in bar]
        except (httpx.HTTPError, ValueError):
            # A chart is a nice-to-have on top of the snapshot — never let
            # its failure take down the snapshot itself.
            price_history = []

        return MarketSnapshot(
            ticker=ticker,
            price=price,
            day_change_pct=day_change_pct,
            market_cap=market_cap,
            # Polygon doesn't provide analyst estimates on this tier.
            analyst_estimates={},
            recent_news=headlines,
            price_history=price_history,
        )
