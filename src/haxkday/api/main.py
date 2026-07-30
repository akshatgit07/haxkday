from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import analyze, tools, voice


def create_app() -> FastAPI:
    app = FastAPI(title="Morgan AI", description="Autonomous financial analyst")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )

    @app.get("/health")
    async def health() -> dict:
        return {"status": "ok"}

    app.include_router(analyze.router)
    app.include_router(voice.router)
    app.include_router(tools.router)

    return app


app = create_app()
