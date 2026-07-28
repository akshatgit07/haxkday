import asyncio
import os

from haxkday.agents.valuation_agent import ValuationAgent
from haxkday.integrations.alpha_vantage_client import AlphaVantageClient
from haxkday.integrations.daytona_client import DaytonaSandboxClient


async def main() -> None:
    alpha_vantage = AlphaVantageClient(api_key=os.environ["ALPHA_VANTAGE_API_KEY"])
    daytona = DaytonaSandboxClient(api_key=os.environ["DAYTONA_API_KEY"])
    agent = ValuationAgent(alpha_vantage, daytona)

    result = await agent.run("NVDA")
    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    asyncio.run(main())
