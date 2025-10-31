from fastapi import APIRouter, HTTPException
from bson import ObjectId
from app.database import db

router = APIRouter(prefix="/inventory", tags=["Inventory"])

# Helper to convert MongoDB _id to string
def serialize_item(item):
    item["_id"] = str(item["_id"])
    return item

@router.get("/")
async def get_all_items():
    """Fetch all inventory items"""
    items = list(db.inventory.find())
    return [serialize_item(item) for item in items]

@router.get("/{category}")
async def get_items_by_category(category: str):
    """Fetch items by category (e.g., laptops, mouses, headphones)"""
    items = list(db.inventory.find({"category": {"$regex": f"^{category}$", "$options": "i"}}))
    if not items:
        raise HTTPException(status_code=404, detail="No items found for this category")
    return [serialize_item(item) for item in items]

@router.get("/item/{item_id}")
async def get_item_by_id(item_id: str):
    """Fetch a single item by ID"""
    try:
        item = db.inventory.find_one({"_id": ObjectId(item_id)})
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        return serialize_item(item)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")
