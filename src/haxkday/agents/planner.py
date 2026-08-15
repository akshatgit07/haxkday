import json

from ..integrations.fireworks_client import FireworksClient
from ..utils import strip_json_fence
from .base import Agent

_SYSTEM_PROMPT = (
    "You are the planning agent for an autonomous financial analyst. Given a "
    "user's request:\n\n"
    "1. Identify the primary US-listed stock ticker the request is about, "
    "uppercase (e.g. \"NVDA\" for Nvidia, \"AMD\" for Advanced Micro Devices). "
    "Set it to null if the request isn't about one specific publicly traded "
    "company, or you can't identify it with real confidence — never guess.\n"
    "2. Break the request into a short, ordered list of concrete "
    "research/analysis tasks the other analyst agents should perform.\n\n"
    "If earlier conversation turns or prior analysis for this user are "
    "supplied before the request, use them to resolve references (\"it\", "
    "\"that company\", \"compare it to AMD\" -> ticker of the company just "
    "discussed) — never as a reason to skip a task the current request "
    "actually needs.\n\n"
    "Respond with a JSON object and nothing else, in this exact shape:\n"
    '{"ticker": "NVDA", "tasks": ["research", "market", "valuation"]}'
)


class PlannerAgent(Agent):
    """Breaks a user request (e.g. "Analyze Nvidia before tomorrow's meeting") into
    a task list for the Research, Market, Valuation, Risk, and Memo agents, and
    resolves the ticker it's about when the caller didn't already supply one."""

    name = "planner"

    def __init__(self, fireworks: FireworksClient) -> None:
        self.fireworks = fireworks

    async def run(self, query: str, context: str = "") -> dict:
        raw = await self.fireworks.complete(_SYSTEM_PROMPT, context + query)
        parsed = json.loads(strip_json_fence(raw))

        ticker = parsed.get("ticker")
        ticker = ticker.strip().upper() if isinstance(ticker, str) and ticker.strip() else None

        tasks = parsed.get("tasks")
        tasks = tasks if isinstance(tasks, list) else []

        return {"ticker": ticker, "tasks": tasks}
