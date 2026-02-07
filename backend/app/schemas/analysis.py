from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class AnalysisRequest(BaseModel):
    idea_id: int

class AnalysisResponse(BaseModel):
    id: int
    idea_id: int
    user_id: int
    market_momentum: Optional[Dict[str, Any]] = None
    competition: Optional[Dict[str, Any]] = None
    capital_funding: Optional[Dict[str, Any]] = None
    public_opinion: Optional[Dict[str, Any]] = None
    future_trends: Optional[Dict[str, Any]] = None
    confidence_score: Optional[float] = None
    data_sources: Optional[List[str]] = None
    processing_time: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
