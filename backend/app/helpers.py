from bson import ObjectId
from fastapi import HTTPException
from bson import ObjectId
from .database import db 
from datetime import datetime

def convert_objectid(doc):
    if not doc:
        return None
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

    new_doc = {}
    for key, value in doc.items():
        if key == "_id":  
            new_doc["_id"] = str(value)
            new_doc["id"] = str(value)   
        else:
            new_doc[key] = value

    return new_doc


def validate_project_uniqueness(project, exclude_id=None):
    if exclude_id:
        if db["projects"].find_one({"projectName": project.projectName, "id": {"$ne": exclude_id}}):
            raise HTTPException(status_code=400, detail="Project Name already exists")
        if db["projects"].find_one({"jiraId": project.jiraId, "id": {"$ne": exclude_id}}):
            raise HTTPException(status_code=400, detail="Jira ID already exists")
    else:
        if db["projects"].find_one({"projectName": project.projectName}):
            raise HTTPException(status_code=400, detail="Project Name already exists")
        if db["projects"].find_one({"jiraId": project.jiraId}):
            raise HTTPException(status_code=400, detail="Jira ID already exists")

def create_system_log(name: str, log_type: str, action: str, status: str):
    """Create a system log entry"""
    try:
        current_time = datetime.utcnow()
        date_str = current_time.strftime("%m-%d-%Y")
        time_str = current_time.strftime("%H:%M:%S")
        
        log_entry = {
            "name": name,
            "type": log_type,
            "action": action,
            "status": status,
            "date": date_str,
            "time": time_str,
            "timestamp": current_time
        }
        
        result = db.system_logs.insert_one(log_entry)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating system log entry: {str(e)}")
        return None

def get_system_logs(page: int = 0, page_size: int = 10, search: str = "",month: str | None = None  ):
    """Get system logs with pagination and search"""
    try:
        skip = page * page_size
        
        # Build query for search
        query = {}
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"type": {"$regex": search, "$options": "i"}},
                {"action": {"$regex": search, "$options": "i"}},
                {"status": {"$regex": search, "$options": "i"}}
            ]

        if month:
            query["date"] = {
                "$regex": f"^{month}",      # Matches "03-xx-2024"
                "$options": "i"
            }
        
        # Get total count
        total = db.system_logs.count_documents(query)
        
        # Get logs with pagination, sorted by timestamp descending
        logs_cursor = db.system_logs.find(query).sort("timestamp", -1).skip(skip).limit(page_size)
        
        logs = []
        for log in logs_cursor:
            log["id"] = str(log["_id"])
            del log["_id"]
            logs.append(log)
        
        return {
            "logs": logs,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size
        }
    except Exception as e:
        print(f"Error fetching system logs: {str(e)}")
        return {"logs": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}