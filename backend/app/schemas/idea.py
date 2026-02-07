from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class IdeaBase(BaseModel):
    title: str
    description: str
    tags: Optional[List[str]] = []

class IdeaCreate(IdeaBase):
    pass

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None

class IdeaResponse(IdeaBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
