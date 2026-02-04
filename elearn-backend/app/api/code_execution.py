from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator
import requests

from app.core.config import JDOODLE_CLIENT_ID, JDOODLE_CLIENT_SECRET


router = APIRouter(prefix="/code-execution", tags=["code-execution"])

# Supported languages on JDoodle
SUPPORTED_LANGUAGES = {
    "nodejs", "python3", "java", "cpp17", "csharp",
    "python2", "cpp14", "cpp", "c", "rb", "go", "php", "scala"
}

MAX_CODE_SIZE = 10000  # 10KB limit


class CodeExecutionRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=MAX_CODE_SIZE)
    language: str = Field(..., min_length=1, max_length=50)
    versionIndex: str | None = "0"
    stdin: str | None = ""

    @validator("code")
    def validate_code(cls, v):
        if not v.strip():
            raise ValueError("Code cannot be empty")
        if len(v) > MAX_CODE_SIZE:
            raise ValueError(f"Code size exceeds {MAX_CODE_SIZE} characters")
        return v

    @validator("language")
    def validate_language(cls, v):
        if v not in SUPPORTED_LANGUAGES:
            raise ValueError(f"Unsupported language: {v}. Supported: {', '.join(sorted(SUPPORTED_LANGUAGES))}")
        return v


@router.post("/run")
def run_code(payload: CodeExecutionRequest):
    if not JDOODLE_CLIENT_ID or not JDOODLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="JDoodle credentials not configured")

    try:
        response = requests.post(
            "https://api.jdoodle.com/v1/execute",
            json={
                "clientId": JDOODLE_CLIENT_ID,
                "clientSecret": JDOODLE_CLIENT_SECRET,
                "script": payload.code,
                "stdin": payload.stdin or "",
                "language": payload.language,
                "versionIndex": payload.versionIndex or "0",
            },
            timeout=20,
        )
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"JDoodle request failed: {exc}")

    if not response.ok:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    data = response.json()
    return {
        "output": data.get("output", ""),
        "statusCode": data.get("statusCode"),
        "memory": data.get("memory"),
        "cpuTime": data.get("cpuTime"),
        "error": data.get("error"),
    }