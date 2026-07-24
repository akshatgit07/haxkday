"""Wraps the Fireworks AI reasoning API used for summaries, explanations, and memo generation."""


class FireworksClient:
    def __init__(self, api_key: str, model: str) -> None:
        self.api_key = api_key
        self.model = model

    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        """Send a prompt to Fireworks and return the generated text."""
        raise NotImplementedError
