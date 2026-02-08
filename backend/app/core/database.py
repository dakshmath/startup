from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from app.core.config import settings

engine = create_engine(settings.POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

async_engine = create_async_engine(
    settings.POSTGRES_URL.replace("postgresql://", "postgresql+asyncpg://")
)
AsyncSessionLocal = sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session
