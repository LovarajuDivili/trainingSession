from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import db
#from app.models.cart import CartCreate, CartUpdate, CartResponse, OrderCreate, OrderResponse
from app.utils.auth import verify_token
from bson import ObjectId
from datetime import datetime
from typing import List

from app.models.schemas import CartCreate, CartResponse, CartUpdate, OrderCreate, OrderResponse

router = APIRouter(prefix="/cart", tags=["cart"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    user = db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return user

@router.get("/", response_model=CartResponse)
async def get_cart(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    cart = db.carts.find_one({"user_id": user_id})
    if not cart:
        # Create empty cart if doesn't exist
        empty_cart = {
            "user_id": user_id,
            "items": [],
            "subtotal": 0.0,
            "vat": 0.0,
            "total": 0.0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = db.carts.insert_one(empty_cart)
        empty_cart["id"] = str(result.inserted_id)
        return empty_cart
    
    cart["id"] = str(cart["_id"])
    del cart["_id"]
    return cart

@router.put("/", response_model=CartResponse)
async def update_cart(cart_update: CartUpdate, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    update_data = cart_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    # Calculate totals if items are updated
    if "items" in update_data:
        subtotal = sum(item["price"] * item["quantity"] for item in update_data["items"])
        vat = subtotal * 0.18
        total = subtotal + vat
        
        update_data["subtotal"] = subtotal
        update_data["vat"] = vat
        update_data["total"] = total
    
    result = db.carts.update_one(
        {"user_id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        # Create cart if doesn't exist
        cart_data = CartCreate(
            user_id=user_id,
            items=cart_update.items or [],
            subtotal=update_data.get("subtotal", 0.0),
            vat=update_data.get("vat", 0.0),
            total=update_data.get("total", 0.0)
        ).dict()
        cart_data["created_at"] = datetime.utcnow()
        cart_data["updated_at"] = datetime.utcnow()
        
        result = db.carts.insert_one(cart_data)
        cart_data["id"] = str(result.inserted_id)
        return cart_data
    
    # Return updated cart
    cart = db.carts.find_one({"user_id": user_id})
    cart["id"] = str(cart["_id"])
    del cart["_id"]
    return cart

@router.delete("/")
async def clear_cart(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    result = db.carts.update_one(
        {"user_id": user_id},
        {"$set": {
            "items": [],
            "subtotal": 0.0,
            "vat": 0.0,
            "total": 0.0,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return {"message": "Cart cleared successfully"}

@router.post("/orders", response_model=OrderResponse)
async def create_order(order_data: OrderCreate, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Verify the order belongs to the current user
    if order_data.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create order for this user"
        )
    
    order_dict = order_data.dict()
    order_dict["order_date"] = datetime.utcnow()
    order_dict["created_at"] = datetime.utcnow()
    
    # Insert order
    result = db.orders.insert_one(order_dict)
    order_dict["id"] = str(result.inserted_id)
    
    # Clear user's cart after successful order
    db.carts.update_one(
        {"user_id": user_id},
        {"$set": {
            "items": [],
            "subtotal": 0.0,
            "vat": 0.0,
            "total": 0.0,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return order_dict

@router.get("/orders", response_model=List[OrderResponse])
async def get_user_orders(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    orders = list(db.orders.find({"user_id": user_id}).sort("order_date", -1))
    
    for order in orders:
        order["id"] = str(order["_id"])
        del order["_id"]
    
    return orders

@router.post("/orders", response_model=OrderResponse)
async def create_order(order_data: OrderCreate, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    # Verify the order belongs to the current user
    if order_data.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create order for this user"
        )
    
    order_dict = order_data.dict()
    order_dict["order_date"] = datetime.utcnow()
    order_dict["created_at"] = datetime.utcnow()
    
    # Insert order
    result = db.orders.insert_one(order_dict)
    order_dict["id"] = str(result.inserted_id)
    
    # Clear user's cart after successful order
    db.carts.update_one(
        {"user_id": user_id},
        {"$set": {
            "items": [],
            "subtotal": 0.0,
            "vat": 0.0,
            "total": 0.0,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return order_dict

@router.get("/orders", response_model=List[OrderResponse])
async def get_user_orders(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    orders = list(db.orders.find({"user_id": user_id}).sort("order_date", -1))
    
    for order in orders:
        order["id"] = str(order["_id"])
        del order["_id"]
    
    return orders

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    
    try:
        order = db.orders.find_one({"_id": ObjectId(order_id), "user_id": user_id})
    except:
        order = None
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    order["id"] = str(order["_id"])
    del order["_id"]
    return order

@router.put("/orders/{order_id}", response_model=OrderResponse)
async def update_order_status(
    order_id: str, 
    status_update: dict, 
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["_id"])
    
    try:
        result = db.orders.update_one(
            {"_id": ObjectId(order_id), "user_id": user_id},
            {"$set": {"status": status_update.get("status", "pending"), "updated_at": datetime.utcnow()}}
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid order ID"
        )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Return updated order
    order = db.orders.find_one({"_id": ObjectId(order_id)})
    order["id"] = str(order["_id"])
    del order["_id"]
    return order