"""Session-scoped working memory: the last few turns of one voice/chat session.

Resolves references a semantic search can't — "compare it to AMD" only
means anything if the last few turns are read in order, not matched by
similarity to "compare it to AMD".
"""

from datetime import datetime, timezone

from ..config import get_settings
from . import store
from ._optional import optional


@optional(store.enabled)
async def append(session_id: str, user_id: str, role: str, text: str, **meta) -> None:
    await store.turns().insert_one(
        {
            "session_id": session_id,
            "user_id": user_id,
            "role": role,
            "text": text,
            "created_at": datetime.now(timezone.utc),
            **meta,
        }
    )


@optional(store.enabled, default=list)
async def recent(session_id: str, limit: int | None = None) -> list[dict]:
    """Most recent turns for this session, oldest first — the order a model expects to read them."""
    limit = limit or get_settings().memory_turn_window
    cursor = store.turns().find({"session_id": session_id}).sort("created_at", -1).limit(limit)
    docs = [doc async for doc in cursor]
    return list(reversed(docs))
