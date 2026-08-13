"""MongoDB Atlas connection and collection handles for the memory layer.

Two collections, two lifetimes:

  turns     Short-term. Every utterance in a voice/chat session, TTL-expired
            after `memory_ttl_seconds` (24h by default). This is what
            resolves "compare it to AMD" — nobody needs last Tuesday's exact
            wording, only what's needed to read the next sentence correctly.
  memories  Long-term. Distilled analyses and durable facts, vector-indexed,
            never expires. This is what answers "what did you tell me about
            Nvidia last week".

If MONGODB_URI is unset, every function in this package no-ops via
`_optional.optional` — the pipeline runs stateless instead of crashing.
"""

import logging

from ..config import get_settings

log = logging.getLogger(__name__)

TURNS = "turns"
MEMORIES = "memories"
VECTOR_INDEX = "memory_vector_index"

_client = None
_db = None


def enabled() -> bool:
    return bool(get_settings().mongodb_uri)


def db():
    """Lazy singleton. The Mongo client connects on first real operation, not here."""
    global _client, _db
    if not enabled():
        return None
    if _db is None:
        from pymongo import AsyncMongoClient

        settings = get_settings()
        _client = AsyncMongoClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
        _db = _client[settings.mongodb_db]
        log.info("mongodb connected: db=%s", settings.mongodb_db)
    return _db


def turns():
    database = db()
    return database[TURNS] if database is not None else None


def memories():
    database = db()
    return database[MEMORIES] if database is not None else None


async def close() -> None:
    global _client, _db
    if _client is not None:
        await _client.close()
        _client, _db = None, None
