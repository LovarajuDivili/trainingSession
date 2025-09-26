from fastapi import FastAPI
import uvicorn
from .routeLayout import api_router

def start_application():
    app = FastAPI(
        title="FastAPI with MongoDB",
        description="training Session",
        version="1.0.0",
        docs_url="/docs",  # Swagger UI
        redoc_url="/redoc",  # ReDoc documentation
        openapi_url="/openapi.json"  # OpenAPI schema
    )
    app.include_router(api_router, prefix="/v-1/application")
    return app

app = start_application()



if __name__ == '__main__':
    uvicorn.run("main:app", host="192.168.209.126", port=8080)