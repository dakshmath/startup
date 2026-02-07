from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.idea import IdeaCreate, IdeaResponse, IdeaUpdate
from app.models.idea import Idea
from app.models.user import User
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=IdeaResponse)
async def create_idea(
    idea: IdeaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_idea = Idea(
        user_id=current_user.id,
        title=idea.title,
        description=idea.description,
        tags=idea.tags
    )
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

@router.get("/", response_model=List[IdeaResponse])
async def get_user_ideas(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ideas = db.query(Idea).filter(
        Idea.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return ideas

@router.get("/{idea_id}", response_model=IdeaResponse)
async def get_idea(
    idea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    idea = db.query(Idea).filter(
        Idea.id == idea_id,
        Idea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found"
        )
    
    return idea

@router.put("/{idea_id}", response_model=IdeaResponse)
async def update_idea(
    idea_id: int,
    idea_update: IdeaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    idea = db.query(Idea).filter(
        Idea.id == idea_id,
        Idea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found"
        )
    
    update_data = idea_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(idea, field, value)
    
    db.commit()
    db.refresh(idea)
    return idea

@router.delete("/{idea_id}")
async def delete_idea(
    idea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    idea = db.query(Idea).filter(
        Idea.id == idea_id,
        Idea.user_id == current_user.id
    ).first()
    
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Idea not found"
        )
    
    db.delete(idea)
    db.commit()
    return {"message": "Idea deleted successfully"}
