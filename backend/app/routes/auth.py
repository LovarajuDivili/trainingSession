from fastapi import APIRouter, Depends, HTTPException, Request, status
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
    timedelta,
    verify_token_allow_expired
)
from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel
import random
from app.models.otp import save_otp, verify_otp
from app.utils.email_service import send_email
from app.utils.logs import create_log_entry  
from jose import jwt, JWTError
from fastapi_sso.sso.google import GoogleSSO
import os
from dotenv import load_dotenv


router = APIRouter(prefix="/auth", tags=["authentication"])
security = HTTPBearer()

load_dotenv()

# Initialize Google SSO
google_sso = GoogleSSO(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_uri=os.getenv("GOOGLE_REDIRECT_URI"),
    allow_insecure_http=True  # For local development only
)

# Helper function to create user response
def create_user_response(user_dict, user_id=None):
    """Create standardized user response dictionary"""
    if user_id:
        user_id_str = str(user_id)
    else:
        user_id_str = str(user_dict.get("_id", ""))
    
    return {
        "id": user_id_str,
        "name": user_dict.get("name", ""),
        "email": user_dict.get("email", ""),
        "role": user_dict.get("role", "user"),
        "profile_image": user_dict.get("profile_image", ""),
        "created_at": user_dict.get("created_at", datetime.utcnow()),
        "auth_provider": user_dict.get("auth_provider", "email")
    }

# Google OAuth routes

# Add this route to routes/auth.py (before Google routes)
@router.get("/debug/google-config")
async def debug_google_config():
    """Debug endpoint to check Google OAuth configuration"""
    import os
    
    config = {
        "GOOGLE_CLIENT_ID": os.getenv("GOOGLE_CLIENT_ID"),
        "GOOGLE_CLIENT_SECRET": os.getenv("GOOGLE_CLIENT_SECRET"),
        "GOOGLE_REDIRECT_URI": os.getenv("GOOGLE_REDIRECT_URI"),
        "SECRET_KEY": os.getenv("SECRET_KEY"),
        "ALGORITHM": os.getenv("ALGORITHM"),
        "ALL_ENV_VARS": dict(os.environ)  # Be careful with this in production
    }
    
    # Mask sensitive values for logging
    masked_config = config.copy()
    if masked_config["GOOGLE_CLIENT_SECRET"]:
        masked_config["GOOGLE_CLIENT_SECRET"] = masked_config["GOOGLE_CLIENT_SECRET"][:10] + "..."
    if masked_config["SECRET_KEY"]:
        masked_config["SECRET_KEY"] = masked_config["SECRET_KEY"][:10] + "..."
    
    print(f"Google OAuth Config: {masked_config}")
    
    return {
        "google_client_id_set": bool(config["GOOGLE_CLIENT_ID"]),
        "google_client_secret_set": bool(config["GOOGLE_CLIENT_SECRET"]),
        "google_redirect_uri_set": bool(config["GOOGLE_REDIRECT_URI"]),
        "config_valid": all([config["GOOGLE_CLIENT_ID"], config["GOOGLE_CLIENT_SECRET"], config["GOOGLE_REDIRECT_URI"]]),
        "redirect_uri": config["GOOGLE_REDIRECT_URI"]
    }

@router.get("/google/login")
async def google_login():
    """Generate Google login URL and redirect to Google"""
    try:
        async with google_sso:
            return await google_sso.get_login_redirect(
                params={"prompt": "select_account"}  # Always show account selector
            )
    except Exception as e:
        print(f"Google login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate Google login"
        )

@router.get("/google/callback", response_model=Token)
async def google_callback(request: Request):
    """Handle Google OAuth2 callback and authenticate/create user"""
    try:
        async with google_sso:
            # Verify and process Google's response
            user_info = await google_sso.verify_and_process(request)
        
        if not user_info or not user_info.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve user information from Google"
            )
        
        # Extract user information
        email = user_info.email
        name = user_info.display_name or email.split('@')[0]
        google_id = user_info.id
        picture = user_info.picture
        
        # Check if user exists in database
        existing_user = db.users.find_one({"email": email})
        
        if existing_user:
            # Check if this is a Google OAuth user
            if existing_user.get("password_hashed_on") != "google_oauth" and existing_user.get("password"):
                # User exists with email/password - update to include Google info
                db.users.update_one(
                    {"_id": existing_user["_id"]},
                    {
                        "$set": {
                            "google_id": google_id,
                            "auth_provider": "both",
                            "email_verified": True,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
            
            # User exists - prepare response
            user_response = create_user_response(existing_user)
        else:
            # Create new user from Google info
            user_dict = {
                "name": name,
                "email": email,
                "role": "user",
                "profile_image": picture,
                "google_id": google_id,
                "password": None,  # No password for Google users
                "password_hashed_on": "google_oauth",
                "auth_provider": "google",
                "email_verified": True,  # Google emails are verified
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = db.users.insert_one(user_dict)
            user_response = create_user_response(user_dict, result.inserted_id)
        
        # Generate JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email, "provider": user_response.get("auth_provider", "google")}, 
            expires_delta=access_token_expires
        )
        
        create_log_entry(email, "google_login", "success")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Google OAuth error: {str(e)}")
        create_log_entry("unknown", "google_login", "failed", str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google authentication failed"
        )

# Authentication dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    
    try:
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
        try:
            payload = jwt.decode(
                token, 
                SECRET_KEY, 
                algorithms=[ALGORITHM], 
                options={"verify_exp": False}
            )
            expired_email = payload.get("sub")
            
            if expired_email:
                current_time = datetime.utcnow()
                one_minute_ago = current_time - timedelta(minutes=1)
                
                existing_auto_logout = db.logs.find_one({
                    "user": expired_email,
                    "action": "logout",
                    "reason": "token_expired",
                    "timestamp": {"$gte": one_minute_ago}
                })
                
                if not existing_auto_logout:
                    create_log_entry(
                        expired_email, 
                        "logout", 
                        "success", 
                        "token_expired"
                    )
        except Exception:
            pass
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    except JWTError:
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
    
    # Check if user is Google OAuth user trying to use email/password login
    if user.get("password_hashed_on") == "google_oauth" or user.get("password") is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account uses Google Sign-In. Please use Google to login.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user["id"] = str(user["_id"])
    del user["_id"]
    del user["password"]
    
    return user

# Regular authentication routes
@router.post("/signup", response_model=Token)
async def signup(user_data: UserCreate):
    try:
        existing_user = db.users.find_one({"email": user_data.email})
        if existing_user:
            # Check if user exists with Google OAuth
            if existing_user.get("password_hashed_on") == "google_oauth":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered with Google. Please use Google Sign-In."
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        user_dict = user_data.dict()
        user_dict["profile_image"] = user_data.profile_image
        
        # Handle password based on hashing method
        if is_bcrypt_hash(user_data.password):
            # Password already hashed on frontend
            user_dict["password"] = user_data.password
            user_dict["password_hashed_on"] = "frontend"
        else:
            # Hash password on backend
            user_dict["password"] = get_password_hash(user_data.password)
            user_dict["password_hashed_on"] = "backend"
        
        # Add additional fields
        user_dict["auth_provider"] = "email"
        user_dict["email_verified"] = False
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        
        # Insert user
        result = db.users.insert_one(user_dict)
        
        # Prepare response
        user_response = create_user_response(user_dict, result.inserted_id)
        
        # Generate token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.email, "provider": "email"}, 
            expires_delta=access_token_expires
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
        create_log_entry(user_data.email if user_data else "unknown", "signup", "error", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during signup"
        )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    try:
        user = db.users.find_one({"email": user_data.email})
        if not user:
            create_log_entry(user_data.email, "login", "failed", "user_not_found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Check if this is a Google OAuth user
        if user.get("password_hashed_on") == "google_oauth" or user.get("password") is None:
            create_log_entry(user_data.email, "login", "failed", "google_user_password_attempt")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This account uses Google Sign-In. Please use Google to login."
            )

        # Verify password based on hashing method
        if user.get("password_hashed_on") == "frontend":
            # Frontend hashed password (SHA256 + BCrypt)
            password_valid = verify_password(user_data.password, user["password"])
        else:
            # Backend hashed password
            password_valid = verify_password(user_data.password, user["password"])

        if not password_valid:
            create_log_entry(user_data.email, "login", "failed", "invalid_password")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Update last login time
        db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"updated_at": datetime.utcnow()}}
        )

        # Prepare user response
        user_response = create_user_response(user)

        # Generate token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_data.email, "provider": user_response.get("auth_provider", "email")}, 
            expires_delta=access_token_expires
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
        create_log_entry(user_data.email, "login", "error", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )

# OTP and Password Reset routes
class SendOtpRequest(BaseModel):
    email: str

@router.post("/send-otp")
async def send_otp(data: SendOtpRequest):
    try:
        email = data.email
        user = db.users.find_one({"email": email})
        
        if not user:
            raise HTTPException(status_code=404, detail="Email not found")
        
        # Check if this is a Google OAuth user
        if user.get("password_hashed_on") == "google_oauth":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google OAuth users cannot reset password via OTP"
            )
        
        otp = str(random.randint(100000, 999999))
        save_otp(email, otp)
        
        subject = "Password Reset OTP"
        message = f"Your OTP for password reset is {otp}"
        
        send_email(email, subject, message)
        
        create_log_entry(email, "send_otp", "success")
        return {"message": "OTP sent successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Send OTP error: {str(e)}")
        create_log_entry(data.email if data else "unknown", "send_otp", "error", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP"
        )

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

@router.post("/verify-otp")
async def verify_otp_route(data: VerifyOtpRequest):
    try:
        if not verify_otp(data.email, data.otp):
            create_log_entry(data.email, "verify_otp", "failed", "invalid_otp")
            raise HTTPException(status_code=400, detail="Invalid OTP")
        
        create_log_entry(data.email, "verify_otp", "success")
        return {"message": "OTP verified"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Verify OTP error: {str(e)}")
        create_log_entry(data.email, "verify_otp", "error", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify OTP"
        )

class ResetPasswordRequest(BaseModel):
    email: str
    newPassword: str

@router.post("/reset-password")
async def reset_password_route(data: ResetPasswordRequest):
    try:
        user = db.users.find_one({"email": data.email})
        if not user:
            raise HTTPException(status_code=404, detail="Email not found")
        
        # Check if this is a Google OAuth user
        if user.get("password_hashed_on") == "google_oauth":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google OAuth users cannot reset password. Please use Google Sign-In."
            )
        
        # Hash the new password
        hashed_password = get_password_hash(data.newPassword)
        
        # Update user password
        db.users.update_one(
            {"email": data.email},
            {
                "$set": {
                    "password": hashed_password,
                    "password_hashed_on": "backend",
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        create_log_entry(data.email, "reset_password", "success")
        return {"message": "Password reset successful"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Reset password error: {str(e)}")
        create_log_entry(data.email, "reset_password", "error", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset password"
        )

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Log manual user logout"""
    try:
        current_time = datetime.utcnow()
        one_minute_ago = current_time - timedelta(minutes=1)
        
        existing_logout = db.logs.find_one({
            "user": current_user["email"],
            "action": "logout",
            "timestamp": {"$gte": one_minute_ago}
        })
        
        if not existing_logout:
            create_log_entry(
                current_user["email"], 
                "logout", 
                "success",
                "manual_logout"
            )
        
        return {"message": "Logged out successfully"}
        
    except Exception as e:
        print(f"Logout logging error: {str(e)}")
        return {"message": "Logged out"}

@router.post("/log-automatic-logout")
async def log_automatic_logout(request: dict):
    """Log automatic logout for expired tokens"""
    try:
        token = request.get("token")
        if not token:
            return {"message": "No token provided"}
        
        email = verify_token_allow_expired(token)
        if not email:
            return {"message": "Invalid token"}
        
        reason = request.get("reason", "token_expired")
        current_time = datetime.utcnow()
        one_minute_ago = current_time - timedelta(minutes=1)
        
        existing_auto_logout = db.logs.find_one({
            "user": email,
            "action": "logout",
            "reason": reason,
            "timestamp": {"$gte": one_minute_ago}
        })
        
        if not existing_auto_logout:
            create_log_entry(
                email, 
                "logout", 
                "success", 
                reason
            )
        
        return {"message": "Automatic logout logged successfully"}
        
    except Exception as e:
        print(f"Automatic logout logging error: {str(e)}")
        return {"message": "Logging failed"}

# Additional helper endpoint
@router.get("/user/auth-method/{email}")
async def get_auth_method(email: str):
    """Get authentication method for a user"""
    try:
        user = db.users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        auth_method = user.get("auth_provider", "email")
        uses_google = user.get("password_hashed_on") == "google_oauth"
        
        return {
            "email": email,
            "auth_provider": auth_method,
            "uses_google_oauth": uses_google,
            "has_password": user.get("password") is not None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get auth method error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get authentication method"
        )