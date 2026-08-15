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
    # Printed by scripts/provision_elevenlabs_agent.py after creating the agent.
    elevenlabs_agent_id: str = Field(default="", alias="ELEVENLABS_AGENT_ID")

    # Sandbox
    daytona_api_key: str = Field(default="", alias="DAYTONA_API_KEY")

    # Observability
    braintrust_api_key: str = Field(default="", alias="BRAINTRUST_API_KEY")
    braintrust_project: str = Field(default="morgan-ai", alias="BRAINTRUST_PROJECT")

    # Memory (MongoDB Atlas + Voyage) — short-term turn log + long-term vector recall
    mongodb_uri: str = Field(default="", alias="MONGODB_URI")
    mongodb_db: str = Field(default="morgan_ai", alias="MONGODB_DB")
    voyage_api_key: str = Field(default="", alias="VOYAGE_API_KEY")
    embedding_model: str = Field(default="voyage-finance-2", alias="EMBEDDING_MODEL")
    embedding_dimensions: int = Field(default=1024, alias="EMBEDDING_DIMENSIONS")
    memory_turn_window: int = Field(default=8, alias="MEMORY_TURN_WINDOW")
    memory_recall_k: int = Field(default=4, alias="MEMORY_RECALL_K")
    memory_min_score: float = Field(default=0.55, alias="MEMORY_MIN_SCORE")
    memory_ttl_seconds: int = Field(default=86400, alias="MEMORY_TTL_SECONDS")

    # Market / filing data
    sec_edgar_user_agent: str = Field(default="", alias="SEC_EDGAR_USER_AGENT")
    alpha_vantage_api_key: str = Field(default="", alias="ALPHA_VANTAGE_API_KEY")
    polygon_api_key: str = Field(default="", alias="POLYGON_API_KEY")
    fmp_api_key: str = Field(default="", alias="FMP_API_KEY")

    # Web research fallback (optional; Polygon/Alpha Vantage remain primary).
    firecrawl_api_key: str = Field(default="", alias="FIRECRAWL_API_KEY")
    firecrawl_api_url: str = Field(default="https://api.firecrawl.dev", alias="FIRECRAWL_API_URL")

    # Web
    cors_allowed_origins: str = Field(default="http://localhost:3000", alias="CORS_ALLOWED_ORIGINS")

    @property
    def cors_allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
