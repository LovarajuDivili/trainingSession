from fastapi import APIRouter, HTTPException, Depends
from ...database import db
from bson import ObjectId
from datetime import datetime
from app.helpers import convert_objectid
from typing import List
from app.schemas import EmployeeCreate,EmployeeUpdate

router = APIRouter(prefix="/employees", tags=["employees"])

# ------------------- GET ALL EMPLOYEES -------------------
@router.get("/", response_model=dict)
async def get_employees():
    try:
        employees_cursor = db["employees"].find()
        employees = []
        for employee in employees_cursor:
            employees.append(convert_objectid(employee))
        return {"status": "success", "data": employees}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------- CREATE EMPLOYEE -------------------
@router.post("/", response_model=dict)
async def create_employee(employee: EmployeeCreate):
    try:
        # Check if employee with same ID already exists
        existing_employee = db["employees"].find_one({"id": employee.id})
        if existing_employee:
            raise HTTPException(status_code=400, detail="Employee with this ID already exists")

        employee_data = {
            "name": employee.name,
            "email": employee.email,
            "role": employee.role,
            "joinDate": employee.joinDate,
            "id": employee.id,
            "skills": employee.skills,
            "created_at": datetime.utcnow()
        }
        
        result = db["employees"].insert_one(employee_data)
        new_employee = db["employees"].find_one({"_id": result.inserted_id})
        return {"status": "success", "data": convert_objectid(new_employee)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------- GET EMPLOYEE BY ID -------------------
@router.get("/{employee_id}", response_model=dict)
async def get_employee_by_id(employee_id: str):
    try:
        employee = db["employees"].find_one({"id": employee_id})
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        return {"status": "success", "data": convert_objectid(employee)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------- UPDATE EMPLOYEE BY ID -------------------
@router.put("/{employee_id}", response_model=dict)
async def update_employee(employee_id: str, update_data: EmployeeUpdate):
    try:
        # Remove None values from update data
        update_fields = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
            
        update_result = db["employees"].update_one(
            {"id": employee_id},
            {"$set": update_fields}
        )
        if update_result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Employee not found")

        updated_employee = db["employees"].find_one({"id": employee_id})
        return {"status": "success", "data": convert_objectid(updated_employee)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------- DELETE EMPLOYEE BY ID -------------------
@router.delete("/{employee_id}", response_model=dict)
async def delete_employee(employee_id: str):
    try:
        delete_result = db["employees"].delete_one({"id": employee_id})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Employee not found")
        return {"status": "success", "message": "Employee deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------- SEARCH EMPLOYEES -------------------
@router.get("/search/", response_model=dict)
async def search_employees(name: str = None, role: str = None):
    try:
        query = {}
        if name:
            query["name"] = {"$regex": name, "$options": "i"}
        if role:
            query["role"] = {"$regex": role, "$options": "i"}
        
        employees_cursor = db["employees"].find(query)
        employees = []
        for employee in employees_cursor:
            employees.append(convert_objectid(employee))
        
        return {"status": "success", "data": employees}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))