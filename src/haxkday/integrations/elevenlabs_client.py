"""Wraps ElevenLabs for speech-to-text (voice question in) and text-to-speech (memo out)."""


class ElevenLabsClient:
    def __init__(self, api_key: str, voice_id: str) -> None:
        self.api_key = api_key
        self.voice_id = voice_id

    async def transcribe(self, audio_bytes: bytes) -> str:
        """Convert a recorded voice question into text."""
        raise NotImplementedError

    async def synthesize(self, text: str) -> bytes:
        """Convert the memo/response text into spoken audio."""
        raise NotImplementedError
