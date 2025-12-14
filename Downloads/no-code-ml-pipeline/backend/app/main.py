"""
FastAPI Application Entry Point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

from app.core.config import settings


# Create uploads and temp directories if they don't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.TEMP_DIR, exist_ok=True)


# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return JSONResponse({
        "message": "No-Code ML Pipeline Builder API",
        "version": settings.VERSION,
        "docs": f"{settings.API_PREFIX}/docs",
    })


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return JSONResponse({
        "status": "healthy",
        "version": settings.VERSION,
    })


# Import and include routers
from app.api import upload, dataset, preprocess, split, model

app.include_router(upload.router, prefix=settings.API_PREFIX, tags=["upload"])
app.include_router(dataset.router, prefix=settings.API_PREFIX, tags=["dataset"])
app.include_router(preprocess.router, prefix=settings.API_PREFIX, tags=["preprocess"])
app.include_router(split.router, prefix=settings.API_PREFIX, tags=["split"])
app.include_router(model.router, prefix=settings.API_PREFIX, tags=["model"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
