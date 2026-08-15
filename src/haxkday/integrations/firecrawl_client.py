"""Optional current-web research through Firecrawl search and extraction."""

import asyncio
from typing import Any

from firecrawl import Firecrawl
from firecrawl.v2.types import ScrapeOptions


class FirecrawlClient:
    def __init__(self, api_key: str, api_url: str = "https://api.firecrawl.dev") -> None:
        self.api_key = api_key.strip()
        self.api_url = api_url

    async def search_company(self, ticker: str, query: str) -> list[dict[str, str]]:
        """Find a small, cited set of current finance pages for the memo prompt."""
        if not self.api_key:
            return []

        search_query = (
            f"{ticker} stock price market cap valuation latest earnings investment risks {query}"
        )

        def _search() -> Any:
            client = Firecrawl(api_key=self.api_key, api_url=self.api_url)
            return client.search(
                search_query,
                sources=["web", "news"],
                limit=5,
                scrape_options=ScrapeOptions(
                    formats=["markdown"],
                    only_main_content=True,
                    max_age=900_000,
                ),
            )

        result = await asyncio.to_thread(_search)
        hits: list[dict[str, str]] = []
        for item in (getattr(result, "web", None) or []) + (getattr(result, "news", None) or []):
            url = str(getattr(item, "url", "") or "")
            title = str(getattr(item, "title", "") or "")
            markdown = str(getattr(item, "markdown", "") or getattr(item, "description", "") or "")
            if url and (title or markdown):
                hits.append({"title": title, "url": url, "content": markdown[:8_000]})
        return hits[:5]
