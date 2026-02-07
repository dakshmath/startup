from fastapi import APIRouter
from .auth import router as auth_router
from .ideas import router as ideas_router
from .analysis import router as analysis_router
from .subscriptions import router as subscriptions_router
from .health import router as health_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(ideas_router, prefix="/ideas", tags=["ideas"])
api_router.include_router(analysis_router, prefix="/analysis", tags=["analysis"])
api_router.include_router(subscriptions_router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(health_router, prefix="/health", tags=["health"])

__all__ = ["api_router"]
