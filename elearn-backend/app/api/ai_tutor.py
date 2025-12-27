from fastapi import APIRouter, Body
from dotenv import load_dotenv
import requests
import os

router = APIRouter()
load_dotenv()
# Hugging Face Inference API (free tier, rate limited)
HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"
HF_TOKEN = os.getenv("HF_API_TOKEN")
HF_HEADERS = {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}

@router.post("/ai-tutor/ask")
async def ask_ai_tutor(question: str = Body(...)):
    if not HF_TOKEN:
        return {"answer": "AI Tutor is not configured. Please set HF_API_TOKEN in your environment."}
    payload = {"inputs": question}
    response = requests.post(HF_API_URL, headers=HF_HEADERS, json=payload)
    if response.ok:
        data = response.json()
        # Hugging Face returns a list of dicts with 'generated_text'
        answer = data[0]["generated_text"] if data and "generated_text" in data[0] else "No answer." 
        return {"answer": answer}
    return {"answer": "Sorry, AI Tutor is unavailable right now."}
