import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-dev-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "elearning_db")

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "mistral:7b")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "replicate") 
REPLICATE_API_KEY = os.getenv("REPLICATE_API_KEY", "")
REPLICATE_MODEL = os.getenv("REPLICATE_MODEL", "replicate/mistral-7b-instruct-v0.2")
 
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash")

RATE_LIMIT_PER_MINUTE = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
RATE_LIMIT_AUTH_PER_MINUTE = int(os.getenv("RATE_LIMIT_AUTH_PER_MINUTE", "10"))

AI_TUTOR_REQUESTS_PER_MINUTE = int(os.getenv("AI_TUTOR_REQUESTS_PER_MINUTE", "5")) 
AI_TUTOR_REQUESTS_PER_HOUR = int(os.getenv("AI_TUTOR_REQUESTS_PER_HOUR", "30"))     
AI_TUTOR_REQUESTS_PER_DAY = int(os.getenv("AI_TUTOR_REQUESTS_PER_DAY", "100"))      
