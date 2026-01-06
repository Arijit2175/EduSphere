
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

SYSTEM_PROMPTS = {
    "direct": "You are a helpful learning assistant named Lumina. Provide clear, concise explanations..."
}

class ChatRequest(BaseModel):
    message: str
    mode: str = "socratic"
    history: List[dict] = []
    context: Optional[dict] = None

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "mistral:7b"

@router.post("/ai-tutor/ask")
async def ask_ai_tutor(data: ChatRequest):
    try:
        # Build prompt with system and history
        prompt = SYSTEM_PROMPTS["direct"] + "\n"
        for msg in data.history:
            if msg['role'] == 'user':
                prompt += f"User: {msg['content']}\n"
            else:
                prompt += f"AI: {msg['content']}\n"
        prompt += f"User: {data.message}\nAI:"

        payload = {
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        }
        response = requests.post(OLLAMA_URL, json=payload, timeout=60)
        response.raise_for_status()
        result = response.json()
        answer = result.get("response", "")
        return {"answer": answer.strip()}
    except Exception as e:
        print("AI Tutor Error:", e)
        raise HTTPException(status_code=500, detail=str(e))
