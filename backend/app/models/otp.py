from datetime import datetime
from app.database import db

def save_otp(email, otp):
    db.password_reset_otps.insert_one({
        "email": email,
        "otp": otp,
        "created_at": datetime.utcnow()
    })

def verify_otp(email, otp):
    record = db.password_reset_otps.find_one({"email": email, "otp": str(otp)})
    return record is not None
