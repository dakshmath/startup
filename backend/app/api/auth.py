from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.models.user import User
from app.services.auth import get_current_user
import firebase_admin
from firebase_admin import auth, credentials
from app.core.config import settings

router = APIRouter()

# Initialize Firebase Admin
if not firebase_admin._apps:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": settings.FIREBASE_PROJECT_ID,
        "private_key": settings.FIREBASE_PRIVATE_KEY,
        "client_email": settings.FIREBASE_CLIENT_EMAIL,
        "token_uri": settings.FIREBASE_TOKEN_URI,
        "auth_uri": settings.FIREBASE_AUTH_URI,
        "auth_provider_x509_cert_url": settings.FIREBASE_AUTH_PROVIDER_CERT_URL,
    })
    firebase_admin.initialize_app(cred)

@router.post("/login", response_model=UserResponse)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    try:
        # Verify Firebase token
        decoded_token = auth.verify_id_token(user_data.firebase_token)
        firebase_uid = decoded_token['uid']
        
        # Get user info from Firebase
        firebase_user = auth.get_user(firebase_uid)
        
        # Check if user exists in our database
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        if not user:
            # Create new user
            user = User(
                firebase_uid=firebase_uid,
                email=firebase_user.email,
                display_name=firebase_user.display_name,
                avatar_url=firebase_user.photo_url
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        return user
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_endpoint(current_user: User = Depends(get_current_user)):
    return current_user
