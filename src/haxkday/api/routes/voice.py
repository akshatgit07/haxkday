import asyncio

from fastapi import APIRouter, HTTPException

from ...config import get_settings
from ...integrations.elevenlabs_client import ElevenLabsClient

router = APIRouter(prefix="/voice", tags=["voice"])


@router.get("/session")
async def get_session() -> dict:
    """Mint a signed URL for the frontend to open a live conversation with the
    ElevenLabs voice agent — this is what makes the "dual-channel" companion
    screen possible, without ever exposing the ElevenLabs API key to the
    browser. The agent must already be provisioned (see
    scripts/provision_elevenlabs_agent.py) with its id set as
    ELEVENLABS_AGENT_ID.
    """
    settings = get_settings()
    if not settings.elevenlabs_agent_id:
        raise HTTPException(status_code=503, detail="Voice agent not provisioned yet (ELEVENLABS_AGENT_ID unset)")

    client = ElevenLabsClient(api_key=settings.elevenlabs_api_key)
    signed_url = await asyncio.to_thread(client.get_signed_conversation_url, settings.elevenlabs_agent_id)
    return {"signed_url": signed_url}
