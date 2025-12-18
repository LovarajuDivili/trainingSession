from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

collections_to_create = [
    "users",
    "projects",
    "employees",
    "inventory",
    "carousel_images",
    "current_openings",
    "carts",
    "orders",
    "chat_messages",
    "logs"  # Ensure logs collection exists
]

try:
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]

    print("✅ MongoDB connected successfully!")

    existing_collections = db.list_collection_names()
    print("Existing collections:", existing_collections)

    for col in collections_to_create:
        if col not in existing_collections:
            db.create_collection(col)
            print(f"✅ Collection '{col}' created")
        else:
            print(f"ℹ️ Collection '{col}' already exists")

    # ✅ Ensure users collection has proper indexes
    if "users" in db.list_collection_names():
        # Create unique index for email (if not exists)
        db.users.create_index("email", unique=True)
        # Create index for google_id (optional for Google OAuth users)
        db.users.create_index("google_id", sparse=True)
        print("✅ Users collection indexes created/updated")

    # ✅ TTL AUTO DELETE INDEX (2 days)
    if "chat_messages" in db.list_collection_names():
        db.chat_messages.create_index(
            "created_at",
            expireAfterSeconds=2 * 24 * 60 * 60
        )
        print("✅ TTL index created: messages auto-delete after 2 days")

    # ✅ TTL index for logs (optional - auto-delete old logs)
    if "logs" in db.list_collection_names():
        db.logs.create_index(
            "timestamp",
            expireAfterSeconds=90 * 24 * 60 * 60  # 90 days
        )
        print("✅ TTL index created: logs auto-delete after 90 days")

except Exception as e:
    print("❌ MongoDB connection failed:", e)
    db = None