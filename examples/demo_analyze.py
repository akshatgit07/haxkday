"""End-to-end demo of the /analyze pipeline through the real FastAPI app.

Everything is real (routing, request validation, Planner -> Memo agent
orchestration, JSON parsing, Pydantic response validation) except the
Fireworks network call itself, which is mocked here. Use this to see the
pipeline work when live outbound access to api.fireworks.ai isn't available
(e.g. inside a network-restricted sandbox); with real network access, drop
the `patch(...)` block and it hits Fireworks for real.
"""

import asyncio
import json
from unittest.mock import AsyncMock, patch

import httpx

from haxkday.api.main import app

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
    with patch("haxkday.api.routes.analyze.FireworksClient") as MockFireworks:
        MockFireworks.return_value.complete = AsyncMock(
            side_effect=[MOCK_PLANNER_RESPONSE, MOCK_MEMO_RESPONSE]
        )

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
