from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from fastapi.responses import JSONResponse
from .routeLayout import api_router

def start_application():
    app = FastAPI(
        title="FastAPI with MongoDB",
        description="training Session",
        version="1.0.0",
        docs_url="/docs",  
        redoc_url="/redoc",  
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000"],  
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        
        print(f"Global error handler: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error"}
        )
    
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    app.include_router(api_router, prefix="/v-1/application")
    

    return app

app = start_application()



if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 