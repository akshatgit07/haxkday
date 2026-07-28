from ..integrations.sec_edgar_client import SecEdgarClient
from ..models.schemas import FilingExcerpt
from .base import Agent

_FILING_TYPES = ("10-K", "10-Q")


class ResearchAgent(Agent):
    """Reads 10-Ks and 10-Qs from SEC EDGAR. Annual reports and earnings call
    transcripts aren't wired to a data source yet."""

    name = "research_analyst"

    def __init__(self, sec_edgar: SecEdgarClient) -> None:
        self.sec_edgar = sec_edgar

    async def run(self, ticker: str) -> list[FilingExcerpt]:
        filings = []
        for filing_type in _FILING_TYPES:
            try:
                filings.append(await self.sec_edgar.get_latest_filing(ticker, filing_type))
            except ValueError:
                continue
        return filings
