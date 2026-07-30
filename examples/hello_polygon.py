import asyncio
import os

from haxkday.integrations.polygon_client import PolygonClient


async def main() -> None:
    client = PolygonClient(api_key=os.environ["POLYGON_API_KEY"])
    snapshot = await client.get_market_snapshot("NVDA")
    print(snapshot.model_dump_json(indent=2))


if __name__ == "__main__":
    asyncio.run(main())
