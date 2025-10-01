from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


from .routeLayout import api_router

def start_application():
    app = FastAPI(
        title="FastAPI with MongoDB",
        description="training Session",
        version="1.0.0",
        docs_url="/docs",  
        redoc_url="/redoc",  
        openapi_url="/openapi.json" 
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix="/v-1/application")
    

    return app

app = start_application()



if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 