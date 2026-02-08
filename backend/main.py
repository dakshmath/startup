from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router
from app.core.config import settings
from app.core.database import init_db

app = FastAPI(
    title="Market Intelligence Platform",
    description="AI-powered market analysis for startup ideas",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Market Intelligence Platform API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.on_event("startup") 
def on_startup(): 
    init_db()