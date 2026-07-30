from ..integrations.polygon_client import PolygonClient
from ..models.schemas import MarketSnapshot
from .base import Agent


class MarketDataAgent(Agent):
    """Retrieves stock prices, market cap, and recent news via Polygon. Analyst
    estimates and broader economic indicators aren't wired to a source yet."""

    name = "market_analyst"

    def __init__(self, polygon: PolygonClient) -> None:
        self.polygon = polygon

    async def run(self, ticker: str) -> MarketSnapshot:
        return await self.polygon.get_market_snapshot(ticker)
