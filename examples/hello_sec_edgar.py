import asyncio
import os

from haxkday.integrations.sec_edgar_client import SecEdgarClient


async def main() -> None:
    client = SecEdgarClient(user_agent=os.environ["SEC_EDGAR_USER_AGENT"])
    filing = await client.get_latest_filing("NVDA", "10-K")
    print(f"{filing.filing_type} for fiscal period {filing.fiscal_period}")
    print(f"source: {filing.source}")
    print(f"{len(filing.text)} chars fetched")


if __name__ == "__main__":
    asyncio.run(main())
