from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from bson import ObjectId

class LogEntry(BaseModel):
    user: str
    action: str
    status: str
    date: str
    time: str
    timestamp: datetime

class LogEntryCreate(BaseModel):
    user: str
    action: str
    status: str
    date: str
    time: str