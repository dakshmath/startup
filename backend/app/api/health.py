from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/")
async def health_check():
    return {
        "status": "healthy",
        "environment": "development",
        "database_connected": True,
        "redis_connected": True
    }
