
import os
import requests
import replicate
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from ..core.config import (
    LLM_PROVIDER,
    REPLICATE_API_KEY,
    REPLICATE_MODEL,
    OLLAMA_URL,
    OLLAMA_MODEL,
    GEMINI_API_KEY,
    GEMINI_MODEL,
    AI_TUTOR_REQUESTS_PER_MINUTE,
    AI_TUTOR_REQUESTS_PER_HOUR,
    AI_TUTOR_REQUESTS_PER_DAY,
)
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

SYSTEM_PROMPTS = {
    "direct": "You are Lumina, a helpful and patient learning assistant. Provide clear, concise explanations. Use simple language. Encourage curiosity and critical thinking.",
    "socratic": "You are Lumina, a Socratic tutor. Instead of giving direct answers, ask guiding questions to help the student discover answers themselves. Be encouraging."
}

class ChatRequest(BaseModel):
    message: str
    mode: str = "direct"
    history: List[dict] = []
    context: Optional[dict] = None

def call_replicate_api(prompt: str) -> str:
    """Call Replicate API for LLM inference."""
    if not REPLICATE_API_KEY:
        raise HTTPException(status_code=500, detail="Replicate API key not configured. Set REPLICATE_API_KEY in .env")
    
    os.environ["REPLICATE_API_TOKEN"] = REPLICATE_API_KEY
    
    try:
        print(f"Calling Replicate model: {REPLICATE_MODEL}")
        print(f"Prompt length: {len(prompt)} characters")
        
        output = replicate.run(
            REPLICATE_MODEL,
            input={
                "prompt": prompt,
                "max_new_tokens": 256,
                "temperature": 0.7,
                "top_p": 0.95
            }
        )
        
        print(f"Replicate output type: {type(output)}")
        
        if isinstance(output, list):
            answer = "".join(str(item) for item in output)
        else:
            answer = str(output)
        
        result = answer.strip()
        print(f"Final answer: {result[:100]}...")
        return result
    
    except Exception as e:
        print(f"Replicate error details: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Replicate API error: {str(e)}")

def call_ollama_api(prompt: str) -> str:
    """Call local Ollama API for LLM inference."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_URL, json=payload, timeout=60)
    response.raise_for_status()
    result = response.json()
    return result.get("response", "").strip()

def call_gemini_api(prompt: str) -> str:
    """Call Google Gemini (AI Studio) via REST."""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured. Set GEMINI_API_KEY in .env")

    url = f"https://generativelanguage.googleapis.com/v1/{GEMINI_MODEL}:generateContent"
    headers = {"Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY}
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    
    print(f"Gemini URL: {url}")
    print(f"Gemini Model: {GEMINI_MODEL}")
    print(f"Gemini API Key (first 20 chars): {GEMINI_API_KEY[:20]}...")
    print(f"Gemini Payload: {payload}")
    
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        print(f"Gemini response status: {resp.status_code}")
        print(f"Gemini response headers: {resp.headers}")
        print(f"Gemini response body: {resp.text}")
        
        if resp.status_code >= 400:
            print("Gemini error status:", resp.status_code)
            print("Gemini error body:", resp.text)
            raise HTTPException(status_code=resp.status_code, detail=f"Gemini API error: {resp.text}")

        data = resp.json()
        candidates = data.get("candidates", [])
        if not candidates:
            raise HTTPException(status_code=500, detail="Gemini returned no candidates")
        parts = candidates[0].get("content", {}).get("parts", [])
        if not parts:
            raise HTTPException(status_code=500, detail="Gemini returned empty content")
        return parts[0].get("text", "").strip()
    except HTTPException:
        raise
    except Exception as e:
        print("Gemini exception:", str(e))
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")


@router.post("/ai-tutor/ask")
@limiter.limit(f"{AI_TUTOR_REQUESTS_PER_MINUTE}/minute;{AI_TUTOR_REQUESTS_PER_HOUR}/hour;{AI_TUTOR_REQUESTS_PER_DAY}/day")
async def ask_ai_tutor(request: Request, data: ChatRequest):
    """AI Tutor endpoint supporting multiple LLM providers."""
    try:
        system_prompt = SYSTEM_PROMPTS.get(data.mode, SYSTEM_PROMPTS["direct"])

        prompt = system_prompt + "\n\n"
        for msg in data.history:
            if msg['role'] == 'user':
                prompt += f"Student: {msg['content']}\n"
            else:
                prompt += f"Lumina: {msg['content']}\n"
        prompt += f"Student: {data.message}\nLumina:"

        if LLM_PROVIDER == "replicate":
            answer = call_replicate_api(prompt)
        elif LLM_PROVIDER == "ollama":
            answer = call_ollama_api(prompt)
        elif LLM_PROVIDER == "gemini":
            answer = call_gemini_api(prompt)
        else:
            raise HTTPException(status_code=500, detail=f"Unknown LLM provider: {LLM_PROVIDER}")

        return {"answer": answer}

    except HTTPException:
        raise
    except Exception as e:
        print(f"AI Tutor Error ({LLM_PROVIDER}):", str(e))
        raise HTTPException(status_code=500, detail=f"AI Tutor error: {str(e)}")
