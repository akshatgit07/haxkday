from ..models.schemas import FilingExcerpt
from .base import Agent


class ResearchAgent(Agent):
    """Reads 10-Ks, 10-Qs, annual reports, and earnings call transcripts."""

    name = "research_analyst"

    async def run(self, ticker: str) -> list[FilingExcerpt]:
        raise NotImplementedError
