"""Wraps the Fireworks AI reasoning API used for summaries, explanations, and memo generation."""

import httpx

_BASE_URL = "https://api.fireworks.ai/inference/v1"


class FireworksClient:
    def __init__(self, api_key: str, model: str) -> None:
        self.api_key = api_key
        self.model = model

    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        """Send a prompt to Fireworks chat completions and return the generated text."""
        async with httpx.AsyncClient(base_url=_BASE_URL, timeout=60) as client:
            response = await client.post(
                "/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                },
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
