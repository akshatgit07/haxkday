from .base import Agent


class PlannerAgent(Agent):
    """Breaks a user request (e.g. "Analyze Nvidia before tomorrow's meeting") into
    a task list for the Research, Market, Valuation, Risk, and Memo agents."""

    name = "planner"

    async def run(self, query: str) -> list[str]:
        raise NotImplementedError
