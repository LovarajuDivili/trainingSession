import json
import base64
from fastapi import APIRouter, HTTPException
from fastapi import Form, File, UploadFile
from ..database import db
from bson import ObjectId
from datetime import datetime
from app.helpers import convert_objectid
from typing import List, Optional
#from app.models.schemas import EmployeeCreate,EmployeeUpdate
from fastapi.responses import JSONResponse
from app.helpers import create_system_log

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("/get_all/", response_model=dict)
async def get_employees():
    try:
        employees_cursor = db["employees"].find()
        employees = []
        for employee in employees_cursor:
            employees.append(convert_objectid(employee))
        return {"status": "success", "data": employees}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create/", response_model=dict)
async def create_employee(
    name: str = Form(...),
    email: str = Form(...),
    role: str = Form(...),
    joinDate: str = Form(...),
    id: str = Form(...),
    skills: str = Form(...),
    laptop: str = Form("false"),
    headphones: str = Form("false"),
    monitor: str = Form("false"),
    image: Optional[str] = Form(None), 
):
    try:
        # Check duplicate email
        existing_employee_email = db["employees"].find_one({"email": email})
        if existing_employee_email:
            create_system_log(
                name=name,
                log_type="employee",
                action="Creation",
                status="failed"
            )
            return JSONResponse(
                status_code=400,
                content={"detail": "Employee with this email already exists"}
            )

        # Convert booleans
        laptop_bool = laptop.lower() == "true"
        headphones_bool = headphones.lower() == "true"
        monitor_bool = monitor.lower() == "true"

        # Handle skills JSON or CSV
        try:
            parsed_skills = json.loads(skills)
        except Exception:
            parsed_skills = [s.strip() for s in skills.split(",")] if skills else []

        # Handle image → Base64
        image_base64 = None
        if image:
            # If it has data URL prefix, remove it
            if "," in image:
                image_base64 = image.split(",")[1]
            else:
                image_base64 = image

       
        employee_data = {
            "name": name,
            "email": email,
            "role": role,
            "joinDate": joinDate,
            "id": id,
            "skills": parsed_skills,
            "laptop": laptop_bool,
            "headphones": headphones_bool,
            "monitor": monitor_bool,
            "image": image_base64, 
            "created_at": datetime.utcnow(),
        }

        result = db["employees"].insert_one(employee_data)
        new_employee = db["employees"].find_one({"_id": result.inserted_id})
        
        create_system_log(
            name=name,
            log_type="employee",
            action="Creation",
            status="success"
        )

        return {"status": "success", "data": convert_objectid(new_employee)}

    except Exception as e:
        if 'name' in locals():
            create_system_log(
                name=name,
                log_type="employee",
                action="Creation",
                status="failed"
            )
        return JSONResponse(status_code=500, content={"detail": str(e)})

@router.get("/get_by_id/{employee_id}", response_model=dict)
async def get_employee_by_id(employee_id: str):
    try:
        employee = db["employees"].find_one({"id": employee_id})
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        return {"status": "success", "data": convert_objectid(employee)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update/{employee_id}", response_model=dict)
async def update_employee(
    employee_id: str,
    name: str = Form(None),
    email: str = Form(None),
    role: str = Form(None),
    joinDate: str = Form(None),
    skills: str = Form(None),
    laptop: str = Form("false"),
    headphones: str = Form("false"),
    monitor: str = Form("false"),
    image: Optional[str] = Form(None)
):
    try:
        update_fields = {}

        
        if image:
            update_fields["image"] = image

       
        if name:
            update_fields["name"] = name
        if email:
            update_fields["email"] = email
        if role:
            update_fields["role"] = role
        if joinDate:
            update_fields["joinDate"] = joinDate
        if laptop is not None:
            update_fields["laptop"] = str(laptop).lower() == "true"
        if headphones is not None:
            update_fields["headphones"] = str(headphones).lower() == "true"
        if monitor is not None:
            update_fields["monitor"] = str(monitor).lower() == "true"
        if skills:
            try:
                update_fields["skills"] = json.loads(skills)
            except Exception:
                update_fields["skills"] = [s.strip() for s in skills.split(",") if s.strip()]

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


@router.delete("/delete/{employee_id}", response_model=dict)
async def delete_employee(employee_id: str):
    try:
        print(f"Attempting to delete employee with ID: {employee_id}")
        delete_result = db["employees"].delete_one({"id": employee_id})
        print(f"Delete result - matched: {delete_result.deleted_count}, deleted: {delete_result.deleted_count}")
        
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        return {"status": "success", "message": "Employee deleted successfully"}
    except Exception as e:
        print(f"Error in delete endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


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