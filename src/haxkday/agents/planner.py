import json

from ..integrations.fireworks_client import FireworksClient
from ..utils import strip_json_fence
from .base import Agent

_SYSTEM_PROMPT = (
    "You are the planning agent for an autonomous financial analyst. Given a "
    "user's request, break it into a short, ordered list of concrete "
    "research/analysis tasks the other analyst agents should perform. "
    "If earlier conversation turns or prior analysis for this user are "
    "supplied before the request, use them only to resolve references "
    "(\"it\", \"that company\", \"compare it to AMD\") — never as a reason to "
    "skip a task the current request actually needs.\n\n"
    "Respond with a JSON array of strings and nothing else."
)


class PlannerAgent(Agent):
    """Breaks a user request (e.g. "Analyze Nvidia before tomorrow's meeting") into
    a task list for the Research, Market, Valuation, Risk, and Memo agents."""

    name = "planner"

    def __init__(self, fireworks: FireworksClient) -> None:
        self.fireworks = fireworks

    async def run(self, query: str, context: str = "") -> list[str]:
        raw = await self.fireworks.complete(_SYSTEM_PROMPT, context + query)
        return json.loads(strip_json_fence(raw))
