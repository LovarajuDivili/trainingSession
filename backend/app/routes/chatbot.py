from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from app.models.schemas import ChatMessage, ChatResponse
import google.generativeai as genai
import os
import time
import secrets

load_dotenv()

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

# ---------------- CONFIG ---------------- #

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY missing in .env")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")

SYSTEM_PROMPT = """
You are a helpful AI assistant for a business application.
Be professional, concise, and helpful.
"""

conversation_store = {}


def get_history(cid: str):
    if cid not in conversation_store:
        conversation_store[cid] = SYSTEM_PROMPT
    return conversation_store[cid]


@router.post("/ask", response_model=ChatResponse)
async def ask_chatbot(data: ChatMessage):
    try:
        cid = data.conversation_id

        if not cid:
            cid = f"conv_{secrets.token_hex(6)}_{int(time.time())}"

        history = get_history(cid)
        full_prompt = f"{history}\n\nUser: {data.message}\nAssistant:"

        response = model.generate_content(full_prompt)
        reply = response.text

        conversation_store[cid] += f"\nUser: {data.message}\nAssistant:{reply}"

        return ChatResponse(
            reply=reply,
            conversation_id=cid
        )

    except Exception as e:
        msg = str(e).lower()

        if "quota" in msg or "429" in msg:
            raise HTTPException(429, "Gemini API quota exceeded.")
        elif "key" in msg or "auth" in msg:
            raise HTTPException(401, "Invalid Gemini API key.")
        else:
            raise HTTPException(500, f"Gemini error: {e}")
