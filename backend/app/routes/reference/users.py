from fastapi import APIRouter, HTTPException
from ...database import db
from ...schemas import User
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/")
async def get_users():
    return {"status": "success", "data": "FETCH USERS"}
    
