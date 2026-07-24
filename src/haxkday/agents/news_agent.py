from .base import Agent


class NewsAgent(Agent):
    """Retrieves recent market news and sentiment relevant to a company."""

    name = "news_analyst"

    async def run(self, ticker: str) -> list[str]:
        raise NotImplementedError
