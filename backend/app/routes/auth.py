from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import db
from app.models.auth import UserCreate, UserLogin, Token, UserResponse
from app.utils.auth import (
    verify_password, 
    get_password_hash,
    is_bcrypt_hash, 
    create_access_token, 
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    timedelta
)
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
import random
from app.models.otp import save_otp, verify_otp
from app.utils.email_service import send_email
from app.utils.email_service import send_email
from app.utils.logs import create_log_entry  
from jose import jwt, JWTError
from app.utils.logs import create_log_entry


router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    
    try:
        # First, try to verify the token normally
        from app.utils.auth import SECRET_KEY, ALGORITHM
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
    except jwt.ExpiredSignatureError:
        # Token is expired - log the automatic logout
        try:
            # Decode without verification to get email from expired token
            payload = jwt.decode(
                token, 
                SECRET_KEY, 
                algorithms=[ALGORITHM], 
                options={"verify_exp": False}
            )
            expired_email = payload.get("sub")
            
            if expired_email:
                # Log the automatic logout due to token expiry
                create_log_entry(expired_email, "logout", "success", "token_expired")
        except Exception:
            pass
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    except JWTError:
        # Other JWT errors
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # If we get here, token is valid
    user = db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["password"]  
    
    return user

@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    try:
        
        existing_user = db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        user_dict = user_data.dict()

        user_dict["profile_image"] = user_data.profile_image  
        if is_bcrypt_hash(user_data.password):
            
            user_dict["password"] = (user_data.password)
            user_dict["password_hashed_on"] = "frontend"
        else:
            
            user_dict["password"] = get_password_hash(user_data.password)
            user_dict["password_hashed_on"] = "frontend"

        user_dict["created_at"] = datetime.utcnow()

        
        result = db.users.insert_one(user_dict)

        user_response = {
            "id": str(result.inserted_id),
            "name": user_data.name,
            "email": user_data.email,
            "role": user_data.role,
            "created_at": user_dict["created_at"]
        }

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.email}, expires_delta=access_token_expires
        )

        create_log_entry(user_data.email, "signup", "success")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during signup"
        )


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    try:
        user = db.users.find_one({"email": user_data.email})
        if not user:
            create_log_entry(user_data.email, "login", "failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        if user.get("password_hashed_on") == "frontend":
            
            password_valid = verify_password(user_data.password, user["password"])
        else:
            
            password_valid = verify_password(user_data.password, user["password"])

        if not password_valid:
            create_log_entry(user_data.email, "login", "failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        user_response = {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "profile_image": user.get("profile_image", ""),
            "created_at": user["created_at"]
        }

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.email}, expires_delta=access_token_expires
        )

        create_log_entry(user_data.email, "login", "success")

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")
        create_log_entry(user_data.email, "login", "error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )
    

class SendOtpRequest(BaseModel):
    email: str

@router.post("/send-otp")
async def send_otp(data: SendOtpRequest):
    email = data.email

    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = str(random.randint(100000, 999999))
    save_otp(email, otp)

    subject = "Password Reset OTP"
    message = f"Your OTP for password reset is {otp}"

    send_email(email, subject, message) 

    return {"message": "OTP sent successfully"}


class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

@router.post("/verify-otp")
async def verify_otp_route(data: VerifyOtpRequest):
    if not verify_otp(data.email, data.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    return {"message": "OTP verified"}


class ResetPasswordRequest(BaseModel):
    email: str
    newPassword: str

@router.post("/reset-password")
async def reset_password_route(data: ResetPasswordRequest):
    
    hashed = get_password_hash(data.newPassword)  

    db.users.update_one(
        {"email": data.email},
        {
            "$set": {
                "password": hashed,
                "password_hashed_on": "frontend"  
            }
        }
    )
    return {"message": "Password reset successful"}

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Log manual user logout"""
    try:
        # Check if a logout entry already exists in the last minute to prevent duplicates
        current_time = datetime.utcnow()
        one_minute_ago = current_time - timedelta(minutes=1)
        
        existing_logout = db.logs.find_one({
            "user": current_user["email"],
            "action": "logout",
            "timestamp": {"$gte": one_minute_ago}
        })
        
        # Only create a new log entry if no recent duplicate exists
        if not existing_logout:
            create_log_entry(
                current_user["email"], 
                "logout", 
                "success"
                # No reason field for manual logout
            )
        
        return {"message": "Logged out successfully"}
    except Exception as e:
        print(f"Logout logging error: {str(e)}")
        return {"message": "Logged out"}
