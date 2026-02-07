from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.subscription import SubscriptionResponse, PlanUpdate
from app.models.subscription import Subscription
from app.models.user import User
from app.services.auth import get_current_user
from app.services.stripe_service import StripeService
import stripe

router = APIRouter()

@router.get("/", response_model=SubscriptionResponse)
async def get_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        # Create free subscription
        subscription = Subscription(
            user_id=current_user.id,
            plan_type="free",
            status="active"
        )
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
    
    return subscription

@router.post("/create-checkout-session")
async def create_checkout_session(
    plan_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    stripe_service = StripeService()
    
    try:
        session = await stripe_service.create_checkout_session(
            user_id=current_user.id,
            plan_type=plan_type
        )
        return {"checkout_url": session.url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    stripe_service = StripeService()
    await stripe_service.handle_webhook(request, db)
    return {"status": "success"}

@router.put("/upgrade", response_model=SubscriptionResponse)
async def update_subscription(
    plan_update: PlanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    stripe_service = StripeService()
    
    try:
        updated_subscription = await stripe_service.update_subscription(
            subscription, plan_update.plan_type
        )
        return updated_subscription
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/cancel")
async def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subscription = db.query(Subscription).filter(
        Subscription.user_id == current_user.id
    ).first()
    
    if not subscription:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found"
        )
    
    stripe_service = StripeService()
    
    try:
        await stripe_service.cancel_subscription(subscription)
        return {"message": "Subscription cancelled successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
