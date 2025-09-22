from fastapi import APIRouter, HTTPException
from ...database import db
from bson import ObjectId
from datetime import datetime
from app.helpers import convert_objectid

router = APIRouter(prefix="/projects", tags=["projects"])


# ------------------- GET ALL PROJECTS -------------------
@router.get("/")
async def get_projects():
    try:
        projects_cursor = db["projects"].find()
        projects = []
        for p in projects_cursor:
            projects.append(convert_objectid(p))
        return {"status": "success", "data": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------- GET PROJECT BY ID -------------------
@router.get("/{project_id}")
async def get_project_by_id(project_id: str):
    try:
        project = db["projects"].find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"status": "success", "data": convert_objectid(project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------- CREATE PROJECT -------------------
@router.post("/")
async def create_project(project: dict):
    try:
        project_data = {
            "name": project.get("name"),
            "jira_id": project.get("jira_id"),
            "created_at": datetime.utcnow()
        }
        result = db["projects"].insert_one(project_data)

        # Update the document to add 'id' = '_id'
        db["projects"].update_one(
            {"_id": result.inserted_id},
            {"$set": {"id": str(result.inserted_id)}}
        )

        new_project = db["projects"].find_one({"_id": result.inserted_id})
        return {"status": "success", "data": convert_objectid(new_project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------- UPDATE PROJECT BY ID -------------------
@router.put("/{project_id}")
async def update_project(project_id: str, update_data: dict):
    try:
        update_result = db["projects"].update_one(
            {"_id": ObjectId(project_id)},
            {"$set": update_data}
        )
        if update_result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")

        updated_project = db["projects"].find_one({"_id": ObjectId(project_id)})
        return {"status": "success", "data": convert_objectid(updated_project)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------- DELETE PROJECT BY ID -------------------
@router.delete("/{project_id}")
async def delete_project(project_id: str):
    try:
        delete_result = db["projects"].delete_one({"_id": ObjectId(project_id)})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
        return {"status": "success", "message": "Project deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
