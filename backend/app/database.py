from pymongo import MongoClient 
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME")

collections_to_create = ["users", "projects", "employees"]

try:
    client = MongoClient(MONGO_URL)
    db = client[DB_NAME]
    print("MongoDB connected successfully!")

    existing_collections = db.list_collection_names()
    print("Existing collections:", existing_collections)

    
    for col in collections_to_create:
        if col not in existing_collections:
            db.create_collection(col)
            print(f"✅Collection '{col}' created")
        else:
            print(f"ℹ️Collection '{col}' already exists")

except Exception as e:
    print("❌MongoDB connection failed or error occurred:", e)
    db = None
