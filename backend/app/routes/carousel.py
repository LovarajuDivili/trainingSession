from fastapi import APIRouter, HTTPException, Form
from typing import List
from bson import ObjectId
from app.models.schemas import CarouselImageCreate, CarouselImageUpdate, CarouselImageResponse
from app.database import db
from datetime import datetime

router = APIRouter(prefix="/carousel", tags=["Carousel"])

@router.get("/", response_model=List[CarouselImageResponse])
async def get_carousel_images(active_only: bool = True):
    try:
        query = {"is_active": True} if active_only else {}
        images = list(db.carousel_images.find(query).sort("order", 1))
        
        # Convert ObjectId to string
        for img in images:
            img["id"] = str(img["_id"])
        
        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching images: {str(e)}")

@router.post("/", response_model=CarouselImageResponse)
async def create_carousel_image(
    title: str = Form(...),
    description: str = Form(None),
    image_data: str = Form(...),  # Receive base64 from frontend
    order: int = Form(0),
    is_active: bool = Form(True)
):
    try:
        carousel_image = {
            "title": title,
            "description": description,
            "image_data": image_data,  # Store base64 directly
            "order": order,
            "is_active": is_active,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = db.carousel_images.insert_one(carousel_image)
        created_image = db.carousel_images.find_one({"_id": result.inserted_id})
        created_image["id"] = str(created_image["_id"])
        
        return created_image
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating image: {str(e)}")

@router.put("/{image_id}", response_model=CarouselImageResponse)
async def update_carousel_image(image_id: str, update_data: CarouselImageUpdate):
    try:
        if not ObjectId.is_valid(image_id):
            raise HTTPException(status_code=400, detail="Invalid image ID")
        
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        result = db.carousel_images.update_one(
            {"_id": ObjectId(image_id)},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Image not found")
        
        updated_image = db.carousel_images.find_one({"_id": ObjectId(image_id)})
        updated_image["id"] = str(updated_image["_id"])
        
        return updated_image
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating image: {str(e)}")

@router.delete("/{image_id}")
async def delete_carousel_image(image_id: str):
    try:
        if not ObjectId.is_valid(image_id):
            raise HTTPException(status_code=400, detail="Invalid image ID")
        
        result = db.carousel_images.delete_one({"_id": ObjectId(image_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Image not found")
        
        return {"message": "Image deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting image: {str(e)}")