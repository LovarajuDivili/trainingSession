from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from app.models.schemas import CurrentOpeningCreate, CurrentOpeningUpdate, CurrentOpeningResponse
from app.database import db
from datetime import datetime

router = APIRouter(prefix="/current-openings", tags=["Current Openings"])

@router.get("/", response_model=List[CurrentOpeningResponse])
async def get_current_openings(active_only: bool = True):
    try:
        query = {"is_active": True} if active_only else {}
        openings = list(db.current_openings.find(query).sort("order", 1))
        
        # Convert ObjectId to string
        for opening in openings:
            opening["id"] = str(opening["_id"])
        
        return openings
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching openings: {str(e)}")

@router.post("/", response_model=CurrentOpeningResponse)
async def create_current_opening(opening_data: CurrentOpeningCreate):
    try:
        current_opening = {
            "title": opening_data.title,
            "department": opening_data.department,
            "applicants": opening_data.applicants,
            "is_active": opening_data.is_active,
            "order": opening_data.order,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = db.current_openings.insert_one(current_opening)
        created_opening = db.current_openings.find_one({"_id": result.inserted_id})
        created_opening["id"] = str(created_opening["_id"])
        
        return created_opening
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating opening: {str(e)}")

@router.put("/{opening_id}", response_model=CurrentOpeningResponse)
async def update_current_opening(opening_id: str, update_data: CurrentOpeningUpdate):
    try:
        if not ObjectId.is_valid(opening_id):
            raise HTTPException(status_code=400, detail="Invalid opening ID")
        
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = db.current_openings.update_one(
            {"_id": ObjectId(opening_id)},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Opening not found")
        
        updated_opening = db.current_openings.find_one({"_id": ObjectId(opening_id)})
        updated_opening["id"] = str(updated_opening["_id"])
        
        return updated_opening
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating opening: {str(e)}")

@router.delete("/{opening_id}")
async def delete_current_opening(opening_id: str):
    try:
        if not ObjectId.is_valid(opening_id):
            raise HTTPException(status_code=400, detail="Invalid opening ID")
        
        result = db.current_openings.delete_one({"_id": ObjectId(opening_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Opening not found")
        
        return {"message": "Opening deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting opening: {str(e)}")