from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
import firebase_admin
from firebase_admin import auth
from typing import Optional
from fastapi import Request

async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    """Extract token from Authorization header and verify it"""
    try:
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing authorization header"
            )
        
        firebase_token = auth_header[7:]  # Remove "Bearer " prefix
        
        # Verify Firebase token
        decoded_token = auth.verify_id_token(firebase_token)
        firebase_uid = decoded_token['uid']
        
        # Get user from database
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )
