"""Wraps ElevenLabs Conversational AI session creation.

The agent itself (persona, tools, turn-taking) is provisioned once via
scripts/provision_elevenlabs_agent.py — it owns voice I/O directly, not this
backend. This client's only job at request time is minting a short-lived
signed URL so the browser can open a live conversation with that agent
without ever seeing the ElevenLabs API key.
"""

from elevenlabs.client import ElevenLabs


class ElevenLabsClient:
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        self._client = ElevenLabs(api_key=api_key)

    def get_signed_conversation_url(self, agent_id: str) -> str:
        """Fetch a short-lived signed URL the frontend uses to open a private
        WebSocket conversation with the given agent."""
        response = self._client.conversational_ai.conversations.get_signed_url(agent_id=agent_id)
        return response.signed_url
