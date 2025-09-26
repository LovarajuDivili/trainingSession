from fastapi import APIRouter
from app.routes.reference.users import router as users_router
from app.routes.reference.projects import router as projects_router
from app.routes.reference.employees import router as employees_router

api_router = APIRouter()
api_router.include_router(projects_router)
api_router.include_router(users_router)
api_router.include_router(employees_router)
