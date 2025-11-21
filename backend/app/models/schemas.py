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

class CarouselImageBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    image_data: Optional[str] = None  # base64 encoded image
    is_active: bool = True
    order: int = 0

class CarouselImageCreate(CarouselImageBase):
    pass

class CarouselImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    image_data: Optional[str] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None

class CarouselImageResponse(CarouselImageBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class CurrentOpeningBase(BaseModel):
    title: str
    department: str
    job_description: Optional[str] = None
    applicants: int
    is_active: bool = True
    order: int = 0

class CurrentOpeningCreate(CurrentOpeningBase):
    pass

class CurrentOpeningUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    job_description: Optional[str] = None
    applicants: Optional[int] = None
    is_active: Optional[bool] = None
    order: Optional[int] = None

class CurrentOpeningResponse(CurrentOpeningBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True