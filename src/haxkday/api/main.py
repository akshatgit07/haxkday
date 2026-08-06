from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ..config import get_settings
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
        return {"status": "ok"}

    @app.get("/")
    async def root() -> dict:
        return {
            "name": "Morgan AI",
            "docs": "/docs",
            "health": "/health",
            "endpoints": ["/analyze", "/tools/analyze", "/tools/scenario", "/voice/session"],
        }

    app.include_router(analyze.router)
    app.include_router(voice.router)
    app.include_router(tools.router)

    return app


app = create_app()
