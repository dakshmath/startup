from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.models.analysis import Analysis
from app.models.idea import Idea
from app.models.user import User
from app.services.auth import get_current_user
from app.services.market_analyzer import MarketAnalyzer
from app.workers.analysis_tasks import analyze_idea_task

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def start_analysis(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get dummy user for testing
    dummy_user = db.query(User).filter(User.email == "test@example.com").first()
    if not dummy_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify idea belongs to user
    idea = db.query(Idea).filter(
        Idea.id == request.idea_id,
        Idea.user_id == dummy_user.id
    ).first()
    
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found"
        )
    
    # Check if analysis already exists
    existing_analysis = db.query(Analysis).filter(
        Analysis.idea_id == request.idea_id
    ).first()
    
    if existing_analysis:
        return existing_analysis
    
    # Create new analysis record
    analysis = Analysis(
        idea_id=request.idea_id,
        user_id=current_user.id,
        status="pending"
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    # Start background analysis task
    background_tasks.add_task(analyze_idea_task, analysis.id)
    
    return analysis

@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)  # Temporarily disabled for testing
):
    # Get dummy user for testing
    dummy_user = db.query(User).filter(User.email == "test@example.com").first()
    if not dummy_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == dummy_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis

@router.get("/idea/{idea_id}", response_model=AnalysisResponse)
async def get_idea_analysis(
    idea_id: int,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user)  # Temporarily disabled for testing
):
    # Get dummy user for testing
    dummy_user = db.query(User).filter(User.email == "test@example.com").first()
    if not dummy_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify idea belongs to user
    idea = db.query(Idea).filter(
        Idea.id == idea_id,
        Idea.user_id == dummy_user.id
    ).first()
    
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found"
        )
    
    analysis = db.query(Analysis).filter(
        Analysis.idea_id == idea_id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found for this idea"
        )
    
    return analysis
