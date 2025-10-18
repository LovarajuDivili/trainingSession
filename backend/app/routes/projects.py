from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from ..database import db
from bson import ObjectId
from datetime import datetime
from app.helpers import convert_objectid, validate_project_uniqueness
from typing import List
from app.schemas import ProjectBase, ProjectCreate, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/get_all/", response_model=dict)
async def get_projects():
    try:
        projects_cursor = db["projects"].find()
        projects = []
        for project in projects_cursor:
            projects.append(convert_objectid(project))
        return {"status": "success", "data": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create/")
async def create_project(project: ProjectBase):
    try:
        validate_project_uniqueness(project)
        project_dict = project.dict()
        project_dict["id"] = "PROJ" + str(int(datetime.now().timestamp() * 1000))
        result = db["projects"].insert_one(project_dict)
        project_dict["_id"] = str(result.inserted_id)
        return {"message": "Project created successfully", "data": convert_objectid(project_dict)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/get_by_id/{project_id}", response_model=dict)
async def get_project_by_id(project_id: str):
    try:
        project = db["projects"].find_one({"id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"status": "success", "data": convert_objectid(project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update/{id}")
async def update_project(id: str, project: ProjectUpdate):
    try:
        existing_project = db["projects"].find_one({"id": id})
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found")

        validate_project_uniqueness(project, exclude_id=id)

        update_data = {k: v for k, v in project.dict().items() if v is not None}

        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        db["projects"].update_one({"id": id}, {"$set": update_data})

        updated_project = db["projects"].find_one({"id": id})
        return {"message": "Project updated successfully", "data": convert_objectid(updated_project)}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/delete/{project_id}", response_model=dict)
async def delete_project(project_id: str):
    try:
        delete_result = db["projects"].delete_one({"id": project_id})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"status": "success", "message": "Project deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/", response_model=dict)
async def search_projects(project_name: str = None, status: str = None):
    try:
        query = {}
        if project_name:
            query["projectName"] = {"$regex": project_name, "$options": "i"}
        if status:
            query["status"] = {"$regex": status, "$options": "i"}
        
        projects_cursor = db["projects"].find(query)
        projects = []
        for project in projects_cursor:
            projects.append(convert_objectid(project))
        
        return {"status": "success", "data": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))