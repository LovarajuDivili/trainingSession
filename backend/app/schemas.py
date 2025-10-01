from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class Item(BaseModel):
    name: str
    description: str
    price: float

class User(BaseModel):
    username: str
    email: str
    role : str

class EmployeeBase(BaseModel):
    name: str
    email: str
    role: str
    joinDate: str 
    id: str
    skills: List[str] = []
    
class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    joinDate: Optional[str] = None
    skills: Optional[List[str]] = None

class EmployeeResponse(EmployeeBase):
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    projectName: str
    projectOwner: str
    jiraId: str
    status: str
    startDate: str
    endDate: str
    id: str

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    projectName: Optional[str] = None
    projectOwner: Optional[str] = None
    jiraId: Optional[str] = None
    status: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None

class ProjectResponse(ProjectBase):
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
