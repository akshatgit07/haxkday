"""Voyage AI embeddings for long-term memory search.

`voyage-finance-2` rather than a general-purpose embedder: the corpus here
is memo text full of domain vocabulary ("gross margin held at 75 percent",
"DCF fair value") that a general embedder tends to flatten, making every
memo look similar to every other memo. 1024 dimensions by default.

`input_type` is not cosmetic — Voyage prepends a different instruction
depending on whether text is being stored or searched. Store with
"document", search with "query"; using the same value for both measurably
degrades recall.
"""

import asyncio

from ..config import get_settings

_client = None


def _voyage():
    global _client
    if _client is None:
        import voyageai

        _client = voyageai.Client(api_key=get_settings().voyage_api_key)
    return _client


async def embed(texts: list[str], *, input_type: str = "document") -> list[list[float]]:
    """Batch-embed. The SDK is sync, so it runs on a thread."""
    if not texts:
        return []
    settings = get_settings()
    response = await asyncio.to_thread(
        _voyage().embed,
        texts,
        model=settings.embedding_model,
        input_type=input_type,
    )
    return response.embeddings


async def embed_one(text: str, *, input_type: str = "document") -> list[float]:
    result = await embed([text], input_type=input_type)
    return result[0]
