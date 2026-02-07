from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Market analysis results
    market_momentum = Column(JSON, nullable=True)  # Score, trends, growth data
    competition = Column(JSON, nullable=True)  # Competitors, market share
    capital_funding = Column(JSON, nullable=True)  # Funding data, investors
    public_opinion = Column(JSON, nullable=True)  # Sentiment analysis
    future_trends = Column(JSON, nullable=True)  # Predictions, forecasts
    
    # Metadata
    confidence_score = Column(Float, nullable=True)
    data_sources = Column(JSON, nullable=True)  # List of data sources used
    processing_time = Column(Float, nullable=True)  # Time in seconds
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    idea = relationship("Idea", back_populates="analysis")
    user = relationship("User")
