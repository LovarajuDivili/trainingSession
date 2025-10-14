from fastapi import APIRouter
from app.routes.users import router as users_router
from app.routes.projects import router as projects_router
from app.routes.employees import router as employees_router
from app.routes.statistics import router as statistics_router
from app.routes.auth import router as auth_router 

api_router = APIRouter()
api_router.include_router(projects_router)
api_router.include_router(users_router)
api_router.include_router(employees_router)
api_router.include_router(statistics_router)
api_router.include_router(auth_router)