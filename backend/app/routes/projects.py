from fastapi import APIRouter, HTTPException
from ..database import db
from bson import ObjectId
from datetime import datetime
from app.helpers import convert_objectid
from typing import List
from app.schemas import ProjectCreate, ProjectUpdate

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/", response_model=dict)
async def get_projects():
    try:
        projects_cursor = db["projects"].find()
        projects = []
        for project in projects_cursor:
            projects.append(convert_objectid(project))
        return {"status": "success", "data": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=dict)
async def create_project(project: ProjectCreate):
    try:
        # Check if project with same ID already exists
        existing_project = db["projects"].find_one({"id": project.id})
        if existing_project:
            return {
                "status": "error",
                "detail": "Project with this ID already exists"
            }

        project_data = {
            "projectName": project.projectName,
            "projectOwner": project.projectOwner,
            "jiraId": project.jiraId,
            "status": project.status,
            "startDate": project.startDate,
            "endDate": project.endDate,
            "id": project.id,
            "created_at": datetime.utcnow()
        }

        result = db["projects"].insert_one(project_data)
        new_project = db["projects"].find_one({"_id": result.inserted_id})

        if not new_project:
            raise HTTPException(status_code=500, detail="Failed to fetch inserted project")

        return {"status": "success", "data": convert_objectid(new_project)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=dict)
async def get_project_by_id(project_id: str):
    try:
        project = db["projects"].find_one({"id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"status": "success", "data": convert_objectid(project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}", response_model=dict)
async def update_project(project_id: str, update_data: ProjectUpdate):
    try:
        update_fields = {k: v for k, v in update_data.dict().items() if v is not None}
        
        if not update_fields:
            raise HTTPException(status_code=400, detail="No fields to update")
            
        update_result = db["projects"].update_one(
            {"id": project_id},
            {"$set": update_fields}
        )
        if update_result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")

        updated_project = db["projects"].find_one({"id": project_id})
        return {"status": "success", "data": convert_objectid(updated_project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}", response_model=dict)
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