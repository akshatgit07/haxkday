"""Wraps SEC EDGAR full-text search and filing retrieval for the Research Analyst."""

from ..models.schemas import FilingExcerpt


class SecEdgarClient:
    def __init__(self, user_agent: str) -> None:
        self.user_agent = user_agent

    async def get_latest_filing(self, ticker: str, filing_type: str) -> FilingExcerpt:
        """Fetch and return the most recent filing of the given type (10-K, 10-Q, ...)."""
        raise NotImplementedError
