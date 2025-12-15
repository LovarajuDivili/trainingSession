from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import Optional
from dotenv import load_dotenv
from app.models.schemas import ChatMessage, ChatResponse
# 1. Remove google.generativeai import
# import google.generativeai as genai
# 2. Add Groq import
from groq import Groq, AsyncGroq  # Use AsyncGroq for async/await
import os
from datetime import datetime, timedelta
from app.database import db
from app.utils.auth import verify_token

load_dotenv()

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

# 3. Change environment variable name
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Changed from GEMINI_API_KEY

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY missing in .env")

# 4. Initialize the Groq async client
client = AsyncGroq(api_key=GROQ_API_KEY)

# 5. Define the Groq model to use
# Available models include: 'llama3-70b-8192', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'
GROQ_MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """
You are a helpful AI assistant. Answer questions clearly and helpfully.
"""

def get_user_conversation_id(user_email: str):
    """Generate or retrieve conversation ID for a user"""
    date_str = datetime.now().strftime("%Y%m%d")
    return f"conv_{user_email}_{date_str}"

def get_user_history(user_email: str, cid: str = None):
    """Get conversation history for a specific user"""
    if not cid:
        cid = get_user_conversation_id(user_email)
    
    cutoff_time = datetime.utcnow() - timedelta(days=2)
    
    messages = list(db.chat_messages.find({
        "user_email": user_email,
        "created_at": {"$gte": cutoff_time}
    }).sort("created_at", 1).limit(50))
    
    # 6. Format history as messages list for Groq API
    history_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in messages:
        role = "user" if msg["sender"] == "user" else "assistant"
        history_messages.append({
            "role": role,
            "content": msg["message"]
        })
    
    return history_messages, cid

async def get_current_user_email(request: Request):
    """Extract user email from token"""
    if request.method == "OPTIONS":
        return None
    
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=401, 
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = auth_header[7:]
    email = verify_token(token)
    
    if not email:
        raise HTTPException(
            status_code=401, 
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return email

@router.post("/ask", response_model=ChatResponse)
async def ask_chatbot(
    request: Request,
    data: ChatMessage,
    user_email: Optional[str] = Depends(get_current_user_email)
):
    try:
        if request.method == "OPTIONS" or user_email is None:
            return JSONResponse(content={}, status_code=200)
        
        if not data.message or not data.message.strip():
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        cid = data.conversation_id
        if not cid:
            cid = get_user_conversation_id(user_email)
        
        # Get formatted message history
        history_messages, cid = get_user_history(user_email, cid)
        
        # Add the new user message to the list
        messages_for_api = history_messages + [{"role": "user", "content": data.message}]
        
        # Use the selected model or default to GROQ_MODEL
        model_to_use = data.model if data.model else GROQ_MODEL
        
        # Call Groq API with the selected model
        try:
            chat_completion = await client.chat.completions.create(
                messages=messages_for_api,
                model=model_to_use,  # Use the selected model
                temperature=0.7,
                max_tokens=1024,
            )
            reply = chat_completion.choices[0].message.content
        except Exception as groq_error:
            raise HTTPException(
                status_code=503, 
                detail=f"AI service error: {str(groq_error)}"
            )
        
        # Save conversation
        current_time = datetime.utcnow()
        db.chat_messages.insert_one({
            "conversation_id": cid,
            "sender": "user",
            "message": data.message,
            "model": model_to_use,  # Save the model used
            "user_email": user_email,
            "created_at": current_time
        })
        db.chat_messages.insert_one({
            "conversation_id": cid,
            "sender": "bot",
            "message": reply,
            "model": model_to_use,  # Save the model used
            "user_email": user_email,
            "created_at": current_time
        })
        
        return ChatResponse(
            reply=reply,
            conversation_id=cid,
            status="success"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error in ask_chatbot: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Internal server error. Please try again later."
        )

@router.options("/ask")
async def options_ask_chatbot():
    """Handle OPTIONS requests for CORS"""
    return JSONResponse(
        content={},
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        }
    )

@router.get("/history")
async def get_chat_history(request: Request, user_email: str):
    """Get chat history for a specific user (last 2 days)"""
    try:
        
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[7:]
            if not verify_token(token):
                raise HTTPException(status_code=401, detail="Invalid token")
        
        cutoff_time = datetime.utcnow() - timedelta(days=2)
        
        msgs = list(db.chat_messages.find({
            "user_email": user_email,
            "created_at": {"$gte": cutoff_time}
        }).sort("created_at", 1))
        
        result = []
        conversation_id = None
        
        for m in msgs:
            result.append({
                "sender": m["sender"],
                "text": m["message"],
                "time": m["created_at"].strftime("%H:%M")
            })
            
            if not conversation_id:
                conversation_id = m["conversation_id"]
        
        return {
            "messages": result,
            "conversation_id": conversation_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching chat history: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching chat history")

@router.options("/history")
async def options_history():
    """Handle OPTIONS requests for history endpoint"""
    return JSONResponse(
        content={},
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        }
    )

@router.delete("/clear-chat")
async def clear_chat_history(
    request: Request,
    user_email: str,
    user_email_from_token: Optional[str] = Depends(get_current_user_email)
):
    """Clear all chat history for a specific user"""
    try:
        if request.method == "OPTIONS" or user_email_from_token is None:
            return JSONResponse(content={}, status_code=200)
        
        # Optional: Verify the user_email from query matches the token user
        if user_email != user_email_from_token:
            raise HTTPException(status_code=403, detail="Not authorized to clear this user's chat")
        
        # Delete all chat messages for this user
        result = db.chat_messages.delete_many({
            "user_email": user_email
        })
        
        return {
            "status": "success",
            "message": f"Cleared {result.deleted_count} messages",
            "deleted_count": result.deleted_count
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error clearing chat history: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Error clearing chat history"
        )

@router.options("/clear-chat")
async def options_clear_chat():
    """Handle OPTIONS requests for clear-chat endpoint"""
    return JSONResponse(
        content={},
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
        }
    )
