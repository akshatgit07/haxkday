"""Assemble the context block prepended to agent prompts."""

import asyncio

from . import long_term, short_term


async def recall_context(query: str, session_id: str, user_id: str) -> dict:
    """Both memory layers, fetched concurrently.

    Short-term resolves reference ("compare it to AMD" -> which company is
    "it"). Long-term supplies history ("you rated this a buy last week at
    92 percent confidence").
    """
    turns, memories = await asyncio.gather(
        short_term.recent(session_id),
        long_term.search(user_id, query),
    )
    return {"turns": turns, "memories": memories}


def format_for_prompt(ctx: dict) -> str:
    """Render recalled context as prose for an agent prompt.

    Empty string when there's nothing to recall — never a header over
    nothing, which a model reads as "the history is empty" rather than
    "there is no history feature".
    """
    if not ctx or (not ctx.get("turns") and not ctx.get("memories")):
        return ""

    parts = []
    if ctx.get("turns"):
        lines = [f"{t['role']}: {t['text']}" for t in ctx["turns"]]
        parts.append("Earlier in this conversation:\n" + "\n".join(lines))

    if ctx.get("memories"):
        lines = [f"- [{m['created_at']:%Y-%m-%d}] {m['text']}" for m in ctx["memories"]]
        parts.append("Relevant analysis for this user from previous sessions:\n" + "\n".join(lines))

    return "\n\n".join(parts) + "\n\n---\n\n"
