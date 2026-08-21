from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ..config import get_settings
from ..memory import store as memory_store
from .routes import analyze, tools, voice


def create_app() -> FastAPI:
    app = FastAPI(title="Morgan AI", description="Autonomous financial analyst")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_settings().cors_allowed_origins_list,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )

    @app.get("/health")
    async def health() -> dict:
        settings = get_settings()
        return {
            "status": "ok",
            "memory": "on" if memory_store.enabled() else "off",
            # This only confirms the key is *set*, not that Braintrust accepts
            # it — the SDK logs asynchronously in a background thread and
            # swallows auth/network failures there (prints a traceback to
            # stderr instead of raising), so a bad key never surfaces as a
            # request-level error. Check Render's log stream for a printed
            # traceback if traces aren't showing up despite this saying "on".
            "braintrust": "configured" if settings.braintrust_api_key else "not configured",
        }

    @app.get("/")
    async def root() -> dict:
        return {
            "name": "Morgan AI",
            "docs": "/docs",
            "health": "/health",
            "endpoints": [
                "/analyze",
                "/tools/analyze",
                "/tools/recall",
                "/tools/scenario",
                "/voice/session",
            ],
        }

    @app.on_event("shutdown")
    async def _shutdown() -> None:
        await memory_store.close()

    app.include_router(analyze.router)
    app.include_router(voice.router)
    app.include_router(tools.router)

    return app


app = create_app()
