"""End-to-end demo of the /analyze pipeline through the real FastAPI app.

Everything is real (routing, request validation, Planner -> Research ->
Valuation -> Memo agent orchestration, JSON parsing, Pydantic response
validation) except the network calls themselves (Fireworks, SEC EDGAR,
Alpha Vantage, Daytona), which are mocked here. Use this to see the
pipeline work when live outbound access isn't available (e.g. inside a
network-restricted sandbox); with real network access, drop the
`patch(...)` calls and it hits all four APIs for real.
"""

import asyncio
import json
from unittest.mock import AsyncMock, MagicMock, patch

import httpx

from haxkday.api.main import app
from haxkday.models.schemas import FilingExcerpt, FinancialSnapshot

MOCK_FINANCIALS = FinancialSnapshot(
    ticker="NVDA",
    revenue_growth_pct=52.0,
    gross_margin_pct=75.0,
    operating_margin_pct=62.0,
    cash_position=30000.0,
    total_debt=10000.0,
    free_cash_flow=30000.0,
)

MOCK_10K = FilingExcerpt(
    source="https://www.sec.gov/Archives/edgar/data/0001045810/nvda-10k.htm",
    filing_type="10-K",
    fiscal_period="2025-01-26",
    text=(
        "NVIDIA Corporation reported record revenue driven by continued strong "
        "demand for its Data Center platform, with gross margins remaining "
        "above 70%. Management cited AI infrastructure buildout as the primary "
        "growth driver, while flagging export control changes as a risk to "
        "sales in certain regions."
    ),
)

MOCK_PLANNER_RESPONSE = json.dumps(
    [
        "Pull NVDA's latest 10-K and recent earnings call",
        "Retrieve current price, market cap, and analyst estimates",
        "Run DCF, PE, and EV/EBITDA valuation",
        "Assess debt, liquidity, margin, and competitive risk",
        "Draft the investment memo",
    ]
)

MOCK_MEMO_RESPONSE = json.dumps(
    {
        "ticker": "NVDA",
        "executive_summary": (
            "NVIDIA continues to benefit from surging AI infrastructure demand, "
            "posting strong revenue growth and industry-leading margins."
        ),
        "bull_case": [
            "AI infrastructure demand remains structurally strong",
            "Market leadership in high-performance GPUs",
            "High and expanding gross margins",
        ],
        "bear_case": [
            "Valuation prices in years of continued hypergrowth",
            "Rising competition from custom silicon and rivals",
            "Export restrictions limit access to key markets",
        ],
        "key_risks": ["Customer concentration", "Geopolitical/export risk", "Cyclicality in AI capex"],
        "recommendation": "BUY",
        "confidence_pct": 92.0,
    }
)


async def main() -> None:
    with (
        patch("haxkday.api.routes.analyze.FireworksClient") as MockFireworks,
        patch("haxkday.api.routes.analyze.SecEdgarClient") as MockSecEdgar,
        patch("haxkday.api.routes.analyze.AlphaVantageClient") as MockAlphaVantage,
        patch("haxkday.api.routes.analyze.DaytonaSandboxClient") as MockDaytona,
    ):
        MockFireworks.return_value.complete = AsyncMock(
            side_effect=[MOCK_PLANNER_RESPONSE, MOCK_MEMO_RESPONSE]
        )
        MockSecEdgar.return_value.get_latest_filing = AsyncMock(
            side_effect=[MOCK_10K, ValueError("no 10-Q on file")]
        )
        MockAlphaVantage.return_value.get_financial_snapshot = AsyncMock(return_value=MOCK_FINANCIALS)
        MockDaytona.return_value.run_code = MagicMock(return_value=json.dumps({"dcf_fair_value": 987654.32}))

        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/analyze",
                json={"query": "Should I invest in Nvidia?", "ticker": "NVDA"},
            )

    print(f"HTTP {response.status_code}\n")
    print(json.dumps(response.json(), indent=2))


if __name__ == "__main__":
    asyncio.run(main())
