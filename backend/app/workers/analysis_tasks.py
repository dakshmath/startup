from celery import Celery
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.analysis import Analysis
from app.models.idea import Idea
from app.services.market_analyzer import MarketAnalyzer
import asyncio

# Initialize Celery
celery_app = Celery(
    'market_intelligence',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

@celery_app.task
def analyze_idea_task(analysis_id: int):
    """Background task to analyze an idea"""
    db = SessionLocal()
    
    try:
        # Get analysis record
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            return {"error": "Analysis not found"}
        
        # Get idea details
        idea = db.query(Idea).filter(Idea.id == analysis.idea_id).first()
        if not idea:
            return {"error": "Idea not found"}
        
        # Update status to analyzing
        analysis.status = "analyzing"
        db.commit()
        
        # Run analysis
        analyzer = MarketAnalyzer()
        
        # Run async function in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            results = loop.run_until_complete(
                analyzer.analyze_idea(idea.title, idea.description)
            )
        finally:
            loop.close()
        
        # Update analysis with results
        analysis.market_momentum = results.get("market_momentum")
        analysis.competition = results.get("competition")
        analysis.capital_funding = results.get("capital_funding")
        analysis.public_opinion = results.get("public_opinion")
        analysis.future_trends = results.get("future_trends")
        analysis.confidence_score = results.get("confidence_score")
        analysis.data_sources = results.get("data_sources")
        analysis.processing_time = results.get("processing_time")
        analysis.status = "completed"
        
        db.commit()
        
        return {"status": "success", "analysis_id": analysis_id}
        
    except Exception as e:
        # Update status to failed
        if analysis:
            analysis.status = "failed"
            db.commit()
        
        return {"error": str(e)}
    
    finally:
        db.close()

# Celery configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)
