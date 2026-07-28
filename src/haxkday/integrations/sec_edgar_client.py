"""Wraps SEC EDGAR filing retrieval for the Research Analyst.

SEC EDGAR has no API key — it requires only a descriptive User-Agent header
identifying the requester, per https://www.sec.gov/os/webmaster-faq#developers.
"""

import httpx

from ..models.schemas import FilingExcerpt

_TICKER_MAP_URL = "https://www.sec.gov/files/company_tickers.json"
_SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik:010d}.json"


class SecEdgarClient:
    def __init__(self, user_agent: str) -> None:
        self.user_agent = user_agent

    async def _get_cik(self, client: httpx.AsyncClient, ticker: str) -> int:
        response = await client.get(_TICKER_MAP_URL)
        response.raise_for_status()
        for entry in response.json().values():
            if entry["ticker"].upper() == ticker.upper():
                return entry["cik_str"]
        raise ValueError(f"Unknown ticker: {ticker}")

    async def get_latest_filing(self, ticker: str, filing_type: str) -> FilingExcerpt:
        """Fetch and return the most recent filing of the given type (10-K, 10-Q, ...)."""
        async with httpx.AsyncClient(headers={"User-Agent": self.user_agent}, timeout=30) as client:
            cik = await self._get_cik(client, ticker)

            response = await client.get(_SUBMISSIONS_URL.format(cik=cik))
            response.raise_for_status()
            recent = response.json()["filings"]["recent"]

            for i, form in enumerate(recent["form"]):
                if form != filing_type:
                    continue
                accession = recent["accessionNumber"][i].replace("-", "")
                document = recent["primaryDocument"][i]
                filing_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{accession}/{document}"

                doc_response = await client.get(filing_url)
                doc_response.raise_for_status()

                return FilingExcerpt(
                    source=filing_url,
                    filing_type=filing_type,
                    fiscal_period=recent["reportDate"][i],
                    text=doc_response.text,
                )

        raise ValueError(f"No {filing_type} filing found for {ticker}")
