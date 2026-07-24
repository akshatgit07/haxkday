from ..models.schemas import MarketSnapshot
from .base import Agent


class MarketDataAgent(Agent):
    """Retrieves stock prices, analyst estimates, and economic indicators."""

    name = "market_analyst"

    async def run(self, ticker: str) -> MarketSnapshot:
        raise NotImplementedError
