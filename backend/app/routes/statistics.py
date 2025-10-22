from fastapi import APIRouter, HTTPException
from ..database import db
from app.helpers import convert_objectid
from typing import Dict, Any
import logging

router = APIRouter(prefix="/statistics", tags=["statistics"])

@router.get("/employee-role-counts", response_model=dict)
async def get_employee_role_counts():
    try:
        
        total_employees = db["employees"].count_documents({})
    
        pipeline = [
            {
                "$group": {
                    "_id": "$role",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        role_counts = list(db["employees"].aggregate(pipeline))

        counts = {
            "AllEmployees": total_employees,
            "Developers": 0,
            "AWSTeam": 0,
            "Testers": 0
        }
        
        role_mapping = {
            "Developer": "Developers",
            "AWS Team": "AWSTeam", 
            "Tester": "Testers"
        }

        for role_data in role_counts:
            role_name = role_data["_id"]
            if role_name in role_mapping:
                counts[role_mapping[role_name]] = role_data["count"]
        
        return {
            "status": "success", 
            "data": counts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/project-status-counts", response_model=dict)
async def get_project_status_counts():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        status_counts = list(db["projects"].aggregate(pipeline))

        counts = {
            "Active": 0,
            "Inactive": 0,
            "InProgress": 0
        }
        
        status_mapping = {
            "Active": "Active",
            "InActive": "Inactive",
            "InProgress": "InProgress"
        }
        
        for status_data in status_counts:
            status_name = status_data["_id"]
            if status_name in status_mapping:
                counts[status_mapping[status_name]] = status_data["count"]
        
        return {
            "status": "success", 
            "data": counts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard-summary", response_model=dict)
async def get_dashboard_summary():
    """
    Combined endpoint to get all statistics data in one call
    """
    try:
        total_employees = db["employees"].count_documents({})
        
        employee_role_pipeline = [
            {
                "$group": {
                    "_id": "$role",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        role_counts = list(db["employees"].aggregate(employee_role_pipeline))
        
        employee_counts = {
            "AllEmployees": total_employees,
            "Developers": 0,
            "AWSTeam": 0,
            "Testers": 0
        }
        
        role_mapping = {
            "Developer": "Developers",
            "AWS Team": "AWSTeam", 
            "Tester": "Testers"
        }
        
        for role_data in role_counts:
            role_name = role_data["_id"]
            if role_name in role_mapping:
                employee_counts[role_mapping[role_name]] = role_data["count"]
 
        total_projects = db["projects"].count_documents({})
        
        project_status_pipeline = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        
        status_counts = list(db["projects"].aggregate(project_status_pipeline))
        
        project_counts = {
            "Active": 0,
            "Inactive": 0,
            "InProgress": 0
        }
        
        status_mapping = {
            "Active": "Active",
            "InActive": "Inactive",
            "InProgress": "InProgress"
        }
        
        for status_data in status_counts:
            status_name = status_data["_id"]
            if status_name in status_mapping:
                project_counts[status_mapping[status_name]] = status_data["count"]
        
        return {
            "status": "success",
            "data": {
                "employees": employee_counts,
                "projects": project_counts,
                "totalEmployees": total_employees,
                "totalProjects": total_projects
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))