"""Create the indexes the memory layer needs. Run once per Atlas cluster:

    pip install -e .
    python scripts/init_mongo.py

Atlas builds vector indexes asynchronously — expect 30-60 seconds before
`/tools/recall` returns anything after this runs. Do this early, not right
before a demo.
"""

import asyncio
import sys

from pymongo import AsyncMongoClient
from pymongo.operations import SearchIndexModel

from haxkday.config import get_settings

settings = get_settings()


async def main() -> None:
    if not settings.mongodb_uri:
        sys.exit("MONGODB_URI not set — nothing to do.")

    client = AsyncMongoClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]

    # Short-term memory expires on its own. 24h by default: long enough for a
    # multi-part conversation, short enough that the collection never grows.
    await db.turns.create_index("created_at", expireAfterSeconds=settings.memory_ttl_seconds)
    await db.turns.create_index([("session_id", 1), ("created_at", -1)])
    print(f"turns: TTL {settings.memory_ttl_seconds}s + session index")

    await db.memories.create_index([("user_id", 1), ("created_at", -1)])
    await db.memories.create_index("tickers")

    # user_id is declared as a filter field so Atlas applies it during the
    # vector scan itself. Filtering after the fact would let one user's
    # nearest neighbours be another user's memories.
    index = SearchIndexModel(
        name="memory_vector_index",
        type="vectorSearch",
        definition={
            "fields": [
                {
                    "type": "vector",
                    "path": "embedding",
                    "numDimensions": settings.embedding_dimensions,
                    "similarity": "cosine",
                },
                {"type": "filter", "path": "user_id"},
                {"type": "filter", "path": "kind"},
                {"type": "filter", "path": "tickers"},
            ]
        },
    )
    try:
        await db.memories.create_search_index(index)
        print(f"memories: vector index queued ({settings.embedding_dimensions}d, cosine)")
        print("Atlas builds this asynchronously — give it ~60s before testing recall.")
    except Exception as exc:  # noqa: BLE001
        print(f"vector index not created: {exc}")
        print("Vector search needs an Atlas cluster — it does not exist on local mongod.")

    await client.close()


if __name__ == "__main__":
    asyncio.run(main())
