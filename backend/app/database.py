from pymongo import MongoClient # type: ignore
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL","mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME","sukanya_db")

collections_to_create = ["users", "projects"]

try:
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    print("✅ MongoDB connected successfully!")

    existing_collections = db.list_collection_names()
    print("Existing collections:", existing_collections)

    # Create collections if they don't exist
    for col in collections_to_create:
        if col not in existing_collections:
            db.create_collection(col)
            print(f"✅ Collection '{col}' created")
        else:
            print(f"ℹ️ Collection '{col}' already exists")

except Exception as e:
    print("❌ MongoDB connection failed or error occurred:", e)
    db = None
