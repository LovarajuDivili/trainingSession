from fastapi import APIRouter
from app.routes.users import router as users_router
from app.routes.projects import router as projects_router
from app.routes.employees import router as employees_router
from app.routes.statistics import router as statistics_router
from app.routes.auth import router as auth_router
from app.routes.inventory import router as inventory_router
from app.routes.carousel import router as carousel_router
from app.routes.current_openings import router as current_openings_router
from app.routes.cart import router as cart_router
from app.routes.logs import router as logs_router
from app.routes.chatbot import router as chatbot_router

api_router = APIRouter()
api_router.include_router(projects_router)
api_router.include_router(users_router)
api_router.include_router(employees_router)
api_router.include_router(statistics_router)
api_router.include_router(auth_router)
api_router.include_router(inventory_router)
api_router.include_router(carousel_router)
api_router.include_router(current_openings_router)
api_router.include_router(cart_router)
api_router.include_router(logs_router)
api_router.include_router(chatbot_router)  