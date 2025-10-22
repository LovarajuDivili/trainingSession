from bson import ObjectId
from fastapi import HTTPException
from bson import ObjectId
from .database import db 

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
