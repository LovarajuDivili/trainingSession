from datetime import datetime
from app.database import db

def create_log_entry(user: str, action: str, status: str, reason: str = None):
    """Create a log entry for user actions"""
    try:
        current_time = datetime.utcnow()
        date_str = current_time.strftime("%m-%d-%Y")
        time_str = current_time.strftime("%H:%M:%S")
        
        log_entry = {
            "user": user,
            "action": action,
            "status": status,
            "date": date_str,
            "time": time_str,
            "timestamp": current_time
        }
        
        if reason:
            log_entry["reason"] = reason
        result = db.logs.insert_one(log_entry)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating log entry: {str(e)}")
        return None

def get_security_logs(page: int = 0, page_size: int = 10, search: str = "",month: str | None = None):
    """Get security logs with pagination and search"""
    try:
        skip = page * page_size
        
        # Build query for search
        query = {}
        if search:
            query["$or"] = [
                {"user": {"$regex": search, "$options": "i"}},
                {"action": {"$regex": search, "$options": "i"}},
                {"status": {"$regex": search, "$options": "i"}}
            ]

        if month:
            query["date"] = {"$regex": f"^{month}", "$options": "i"}
        
        # Get total count
        total = db.logs.count_documents(query)
        
        # Get logs with pagination, sorted by timestamp descending
        logs_cursor = db.logs.find(query).sort("timestamp", -1).skip(skip).limit(page_size)
        
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
        print(f"Error fetching logs: {str(e)}")
        return {"logs": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}