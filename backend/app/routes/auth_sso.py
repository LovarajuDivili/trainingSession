from fastapi import APIRouter, HTTPException
from jose import jwt
import requests
from datetime import timedelta
from app.database import db
from app.utils.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["authentication"])

# Example for Auth0 (values will come from env)
AUTH0_DOMAIN = "dev-sgb766u7iiiyynso.us.auth0.com"
AUTH0_AUDIENCE = "https://api.sasa.com"
ALGORITHMS = ["RS256"]

JWKS = requests.get(
    f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
).json()

def get_auth0_public_key(token: str):
    unverified_header = jwt.get_unverified_header(token)

    for key in JWKS["keys"]:
        if key["kid"] == unverified_header["kid"]:
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }

    raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/sso-login")
async def sso_login(token: dict):
    id_token = token.get("id_token")

    if not id_token:
        raise HTTPException(status_code=400, detail="Missing id_token")

    try:
        public_key = get_auth0_public_key(id_token)

        payload = jwt.decode(
            id_token,
            public_key,
            algorithms=ALGORITHMS,
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )

        email = payload["email"]
        name = payload.get("name", "")
        picture = payload.get("picture", "")

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid SSO token")

    # 🔁 JIT User Creation
    user = db.users.find_one({"email": email})

    if not user:
        user = {
            "email": email,
            "name": name,
            "role": "user",
            "profile_image": picture
        }
        db.users.insert_one(user)

    # 🔐 Issue YOUR app token
    access_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": email,
            "name": name,
            "role": user.get("role", "user"),
            "profile_image": picture
        }
    }
