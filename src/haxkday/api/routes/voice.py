from fastapi import APIRouter, UploadFile

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/ask")
async def ask(audio: UploadFile) -> dict:
    """Transcribe a spoken question, run analysis, and return a spoken response."""
    raise NotImplementedError
