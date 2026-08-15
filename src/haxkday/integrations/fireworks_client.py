"""Wraps the Fireworks AI reasoning API used for summaries and memo generation."""

import httpx

_BASE_URL = "https://api.fireworks.ai/inference/v1"


class FireworksError(RuntimeError):
    """An actionable failure talking to Fireworks."""

    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


class FireworksClient:
    def __init__(self, api_key: str, model: str) -> None:
        self.api_key = api_key
        self.model = model

    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        """Send a prompt to Fireworks chat completions and return the generated text."""
        if not self.api_key.strip():
            raise FireworksError("FIREWORKS_API_KEY is not configured on the backend")

        try:
            async with httpx.AsyncClient(base_url=_BASE_URL, timeout=httpx.Timeout(60.0, connect=10.0)) as client:
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
        except httpx.TimeoutException as exc:
            raise FireworksError("Fireworks request timed out after 60 seconds") from exc
        except httpx.RequestError as exc:
            raise FireworksError(f"Fireworks network error: {exc.__class__.__name__}") from exc

        if response.is_error:
            detail = ""
            try:
                payload = response.json()
                detail = payload.get("error", {}).get("message", "")
            except (ValueError, AttributeError):
                pass
            suffix = f": {detail}" if detail else ""
            if response.status_code in (401, 403):
                raise FireworksError(
                    "Fireworks rejected FIREWORKS_API_KEY; verify the key is active and has inference access"
                    + suffix,
                    status_code=response.status_code,
                )
            raise FireworksError(
                f"Fireworks returned HTTP {response.status_code}{suffix}", status_code=response.status_code
            )

        try:
            content = response.json()["choices"][0]["message"]["content"]
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            raise FireworksError("Fireworks returned an unexpected completion payload") from exc
        if not isinstance(content, str) or not content.strip():
            raise FireworksError("Fireworks returned an empty completion")
        return content
