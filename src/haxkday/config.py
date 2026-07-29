from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central place all agents/integrations read their API keys and options from."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Reasoning
    fireworks_api_key: str = Field(default="", alias="FIREWORKS_API_KEY")
    fireworks_model: str = Field(
        default="accounts/fireworks/models/llama-v3p1-70b-instruct",
        alias="FIREWORKS_MODEL",
    )

    # Voice
    elevenlabs_api_key: str = Field(default="", alias="ELEVENLABS_API_KEY")
    elevenlabs_voice_id: str = Field(default="", alias="ELEVENLABS_VOICE_ID")
    # Shared secret the ElevenLabs Conversational AI agent sends on every
    # server-tool webhook call, so /tools/analyze can reject everyone else.
    elevenlabs_webhook_secret: str = Field(default="", alias="ELEVENLABS_WEBHOOK_SECRET")

    # Sandbox
    daytona_api_key: str = Field(default="", alias="DAYTONA_API_KEY")

    # Observability
    braintrust_api_key: str = Field(default="", alias="BRAINTRUST_API_KEY")
    braintrust_project: str = Field(default="morgan-ai", alias="BRAINTRUST_PROJECT")

    # Market / filing data
    sec_edgar_user_agent: str = Field(default="", alias="SEC_EDGAR_USER_AGENT")
    alpha_vantage_api_key: str = Field(default="", alias="ALPHA_VANTAGE_API_KEY")
    polygon_api_key: str = Field(default="", alias="POLYGON_API_KEY")
    fmp_api_key: str = Field(default="", alias="FMP_API_KEY")


@lru_cache
def get_settings() -> Settings:
    return Settings()
