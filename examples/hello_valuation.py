import asyncio
import os

from haxkday.agents.valuation_agent import ValuationAgent
from haxkday.integrations.daytona_client import DaytonaSandboxClient
from haxkday.models.schemas import FinancialSnapshot


async def main() -> None:
    daytona = DaytonaSandboxClient(api_key=os.environ["DAYTONA_API_KEY"])
    agent = ValuationAgent(daytona)

    snapshot = FinancialSnapshot(
        ticker="NVDA",
        revenue_growth_pct=52.0,
        gross_margin_pct=75.0,
        free_cash_flow=30000.0,
    )
    result = await agent.run(snapshot)
    print(result.model_dump_json(indent=2))


if __name__ == "__main__":
    asyncio.run(main())
