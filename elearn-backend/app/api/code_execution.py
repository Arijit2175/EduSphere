from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import requests

from app.core.config import JDOODLE_CLIENT_ID, JDOODLE_CLIENT_SECRET


router = APIRouter(prefix="/code-execution", tags=["code-execution"])


class CodeExecutionRequest(BaseModel):
    code: str = Field(..., min_length=1)
    language: str
    versionIndex: str | None = "0"
    stdin: str | None = ""


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