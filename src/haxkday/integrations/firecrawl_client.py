"""Web search fallback through Firecrawl, used only when SEC EDGAR can't
answer — a rejected/unknown ticker, an outage, or an unrecognized filing
type. Never a substitute for a real filing citation, only a way to still
ground the memo in something when EDGAR comes back empty.
"""

import asyncio

from firecrawl import Firecrawl


class FirecrawlClient:
    def __init__(self, api_key: str, api_url: str = "https://api.firecrawl.dev") -> None:
        self.api_key = api_key.strip()
        self.api_url = api_url

    async def search_company(self, ticker: str, query: str) -> list[dict[str, str]]:
        """Find a small, cited set of current web/news hits for the memo prompt."""
        if not self.api_key:
            return []

        search_query = f"{ticker} stock latest earnings valuation risks {query}"

        def _search():
            client = Firecrawl(api_key=self.api_key, api_url=self.api_url)
            return client.search(search_query, sources=["web", "news"], limit=5)

        result = await asyncio.to_thread(_search)

        hits: list[dict[str, str]] = []
        for item in result.web or []:
            if item.url and (item.title or item.description):
                hits.append({"title": item.title or "", "url": item.url, "content": (item.description or "")[:2_000]})
        for item in result.news or []:
            if item.url and (item.title or item.snippet):
                hits.append({"title": item.title or "", "url": item.url, "content": (item.snippet or "")[:2_000]})
        return hits[:5]
