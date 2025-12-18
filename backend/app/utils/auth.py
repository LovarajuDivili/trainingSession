from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
import re
from dotenv import load_dotenv

load_dotenv()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Generate bcrypt hash for password"""
    return pwd_context.hash(password)

def is_bcrypt_hash(password: str) -> bool:
    """Check if a string is already a bcrypt hash"""
    if not password or len(password) < 60:
        return False
    # Bcrypt hash pattern: $2a$, $2b$, $2y$ followed by cost parameter and hash
    return password.startswith("$2") and password[2] in ['a', 'b', 'y'] and password[3] == '$'

def validate_password_strength(password: str) -> Dict[str, Any]:
    """Validate password strength"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one number")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
    
    return {
        "is_valid": len(errors) == 0,
        "errors": errors,
        "score": 5 - len(errors)  # Simple score out of 5
    }

# JWT token utilities
def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: Dict[str, Any]) -> str:
    """Create a JWT refresh token (longer expiration)"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)  # 7 days for refresh token
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email if valid"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

def verify_token_allow_expired(token: str) -> Optional[str]:
    """Verify token but allow expired tokens"""
    try:
        payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM],
            options={"verify_exp": False}
        )
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode JWT token without verification"""
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_signature": False}
        )
        return payload
    except JWTError:
        return None

def is_token_expired(token: str) -> bool:
    """Check if a token is expired"""
    try:
        payload = decode_token(token)
        if not payload:
            return True
        
        exp = payload.get("exp")
        if not exp:
            return True
        
        expiration_time = datetime.fromtimestamp(exp)
        return expiration_time < datetime.utcnow()
    except Exception:
        return True

def get_token_expiration(token: str) -> Optional[datetime]:
    """Get token expiration datetime"""
    try:
        payload = decode_token(token)
        if not payload:
            return None
        
        exp = payload.get("exp")
        if not exp:
            return None
        
        return datetime.fromtimestamp(exp)
    except Exception:
        return None

# Google OAuth utilities
def validate_google_oauth_config() -> bool:
    """Validate Google OAuth configuration"""
    required_vars = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"]
    
    for var in required_vars:
        if not os.getenv(var):
            print(f"Warning: {var} is not set in environment variables")
            return False
    
    return True

def get_google_oauth_url(state: Optional[str] = None) -> str:
    """Generate Google OAuth URL"""
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account"
    }
    
    if state:
        params["state"] = state
    
    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    return f"{base_url}?{query_string}"

# User utilities
def create_user_token_payload(user: Dict[str, Any]) -> Dict[str, Any]:
    """Create token payload from user data"""
    return {
        "sub": user.get("email"),
        "user_id": str(user.get("_id", "")),
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "auth_provider": user.get("auth_provider", "email"),
        "email_verified": user.get("email_verified", False)
    }

def mask_email(email: str) -> str:
    """Mask email for display (e.g., j****@example.com)"""
    if "@" not in email:
        return email
    
    local_part, domain = email.split("@", 1)
    
    if len(local_part) <= 2:
        masked_local = local_part[0] + "*" * max(0, len(local_part) - 1)
    else:
        masked_local = local_part[0] + "*" * (len(local_part) - 2) + local_part[-1]
    
    return f"{masked_local}@{domain}"

def generate_secure_random_string(length: int = 32) -> str:
    """Generate a secure random string for tokens, states, etc."""
    import secrets
    import string
    
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

# Security validations
def validate_email_format(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def sanitize_user_input(input_str: str, max_length: int = 255) -> str:
    """Sanitize user input to prevent injection attacks"""
    if not input_str:
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\']', '', input_str)
    
    # Limit length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip()

# Token blacklist management (simple in-memory example)
# In production, use Redis or database for token blacklist
_token_blacklist = set()

def blacklist_token(token: str) -> None:
    """Add token to blacklist"""
    _token_blacklist.add(token)

def is_token_blacklisted(token: str) -> bool:
    """Check if token is blacklisted"""
    return token in _token_blacklist

def clear_expired_blacklist_tokens() -> None:
    """Clear expired tokens from blacklist (call periodically)"""
    global _token_blacklist
    current_tokens = list(_token_blacklist)
    
    for token in current_tokens:
        if is_token_expired(token):
            _token_blacklist.remove(token)

# Rate limiting utilities
_login_attempts = {}

def track_login_attempt(email: str, success: bool = False) -> None:
    """Track login attempts for rate limiting"""
    from datetime import datetime, timedelta
    
    if email not in _login_attempts:
        _login_attempts[email] = {
            "attempts": [],
            "locked_until": None
        }
    
    now = datetime.now()
    
    # Clean old attempts (last 15 minutes)
    _login_attempts[email]["attempts"] = [
        attempt for attempt in _login_attempts[email]["attempts"]
        if now - attempt < timedelta(minutes=15)
    ]
    
    if not success:
        _login_attempts[email]["attempts"].append(now)
    
    # Check if account should be locked
    failed_attempts = len(_login_attempts[email]["attempts"])
    if failed_attempts >= 5:
        _login_attempts[email]["locked_until"] = now + timedelta(minutes=15)

def is_account_locked(email: str) -> bool:
    """Check if account is locked due to too many failed attempts"""
    if email not in _login_attempts:
        return False
    
    account_data = _login_attempts[email]
    
    if account_data["locked_until"]:
        from datetime import datetime
        if datetime.now() < account_data["locked_until"]:
            return True
        else:
            # Lock expired, reset
            account_data["locked_until"] = None
            account_data["attempts"] = []
    
    return False

def reset_login_attempts(email: str) -> None:
    """Reset login attempts for an email"""
    if email in _login_attempts:
        _login_attempts[email] = {
            "attempts": [],
            "locked_until": None
        }