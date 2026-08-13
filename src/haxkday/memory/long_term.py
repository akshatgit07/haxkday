"""Cross-session semantic memory, backed by MongoDB Atlas Vector Search."""

from datetime import datetime, timezone

from ..config import get_settings
from . import embeddings, store
from ._optional import optional


@optional(store.enabled)
async def write(
    user_id: str,
    text: str,
    *,
    kind: str = "analysis",
    tickers: list[str] | None = None,
    metadata: dict | None = None,
) -> None:
    """Persist one durable memory with its embedding.

    `text` must be self-contained prose — "BUY, 92%" is meaningless in a
    vector search six days later; "Rated NVDA a buy at 92 percent confidence
    on data-center demand, flagged export-control risk" isn't.
    """
    vector = await embeddings.embed_one(text, input_type="document")
    await store.memories().insert_one(
        {
            "user_id": user_id,
            "kind": kind,
            "text": text,
            "tickers": [t.upper() for t in (tickers or [])],
            "embedding": vector,
            "metadata": metadata or {},
            "created_at": datetime.now(timezone.utc),
        }
    )


@optional(store.enabled, default=list)
async def search(user_id: str, query: str, *, limit: int | None = None) -> list[dict]:
    """Semantic recall scoped to this user.

    `user_id` is declared as a filter field on the vector index (see
    scripts/init_mongo.py) so Atlas applies it during the vector scan
    itself, not after. Dropping it would let one user's memories surface in
    another's analysis — this is a security boundary, not an optimization.
    """
    settings = get_settings()
    limit = limit or settings.memory_recall_k
    vector = await embeddings.embed_one(query, input_type="query")

    pipeline = [
        {
            "$vectorSearch": {
                "index": store.VECTOR_INDEX,
                "path": "embedding",
                "queryVector": vector,
                "numCandidates": limit * 20,
                "limit": limit,
                "filter": {"user_id": user_id},
            }
        },
        {
            "$project": {
                "_id": 0,
                "text": 1,
                "kind": 1,
                "tickers": 1,
                "metadata": 1,
                "created_at": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        },
        {"$match": {"score": {"$gte": settings.memory_min_score}}},
    ]
    return [doc async for doc in store.memories().aggregate(pipeline)]
