import stripe
from sqlalchemy.orm import Session
from app.models.subscription import Subscription
from app.core.config import settings
from typing import Optional

class StripeService:
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        # Define pricing plans
        self.plans = {
            "pro": {
                "price_id": "price_pro_monthly",  # Replace with actual Stripe price ID
                "amount": 2900,  # $29.00 in cents
                "currency": "usd",
                "interval": "month"
            },
            "enterprise": {
                "price_id": "price_enterprise_monthly",  # Replace with actual Stripe price ID
                "amount": 9900,  # $99.00 in cents
                "currency": "usd", 
                "interval": "month"
            }
        }
    
    async def create_checkout_session(self, user_id: int, plan_type: str) -> stripe.checkout.Session:
        if plan_type not in self.plans:
            raise ValueError(f"Invalid plan type: {plan_type}")
        
        plan = self.plans[plan_type]
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': plan['currency'],
                    'product_data': {
                        'name': f'Market Intelligence Platform - {plan_type.title()} Plan',
                        'description': f'Monthly {plan_type} subscription',
                    },
                    'unit_amount': plan['amount'],
                    'recurring': {
                        'interval': plan['interval'],
                    },
                },
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'http://localhost:3000/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'http://localhost:3000/cancel',
            metadata={
                'user_id': user_id,
                'plan_type': plan_type
            }
        )
        
        return session
    
    async def handle_webhook(self, request, db: Session):
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise ValueError("Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise ValueError("Invalid signature")
        
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            await self._handle_checkout_completed(session, db)
        elif event['type'] == 'invoice.payment_succeeded':
            invoice = event['data']['object']
            await self._handle_payment_succeeded(invoice, db)
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            await self._handle_subscription_deleted(subscription, db)
    
    async def _handle_checkout_completed(self, session, db: Session):
        user_id = int(session['metadata']['user_id'])
        plan_type = session['metadata']['plan_type']
        
        # Update or create subscription
        subscription = db.query(Subscription).filter(
            Subscription.user_id == user_id
        ).first()
        
        if not subscription:
            subscription = Subscription(user_id=user_id)
            db.add(subscription)
        
        subscription.stripe_customer_id = session['customer']
        subscription.stripe_subscription_id = session['subscription']
        subscription.plan_type = plan_type
        subscription.status = 'active'
        
        db.commit()
    
    async def _handle_payment_succeeded(self, invoice, db: Session):
        subscription_id = invoice['subscription']
        
        subscription = db.query(Subscription).filter(
            Subscription.stripe_subscription_id == subscription_id
        ).first()
        
        if subscription:
            subscription.status = 'active'
            db.commit()
    
    async def _handle_subscription_deleted(self, subscription_obj, db: Session):
        subscription = db.query(Subscription).filter(
            Subscription.stripe_subscription_id == subscription_obj['id']
        ).first()
        
        if subscription:
            subscription.status = 'cancelled'
            db.commit()
    
    async def update_subscription(self, subscription: Subscription, new_plan_type: str) -> Subscription:
        if new_plan_type not in self.plans:
            raise ValueError(f"Invalid plan type: {new_plan_type}")
        
        # Update subscription in Stripe
        stripe_subscription = stripe.Subscription.modify(
            subscription.stripe_subscription_id,
            items=[{
                'id': stripe.Subscription.retrieve(subscription.stripe_subscription_id)['items']['data'][0].id,
                'price': self.plans[new_plan_type]['price_id']
            }]
        )
        
        # Update local subscription
        subscription.plan_type = new_plan_type
        subscription.status = 'active'
        
        return subscription
    
    async def cancel_subscription(self, subscription: Subscription):
        # Cancel subscription in Stripe
        stripe.Subscription.delete(subscription.stripe_subscription_id)
        
        # Update local subscription
        subscription.status = 'cancelled'
        subscription.cancel_at_period_end = True
