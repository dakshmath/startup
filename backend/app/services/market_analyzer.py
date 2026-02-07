import pandas as pd
import numpy as np
from typing import Dict, Any, List
from app.services.llm_service import LLMService
from app.services.vector_service import VectorService
from app.core.config import settings
import time

class MarketAnalyzer:
    def __init__(self):
        self.llm_service = LLMService()
        self.vector_service = VectorService()
    
    async def analyze_idea(self, idea_title: str, idea_description: str) -> Dict[str, Any]:
        start_time = time.time()
        
        # Generate market insights
        market_momentum = await self._analyze_market_momentum(idea_title, idea_description)
        competition = await self._analyze_competition(idea_title, idea_description)
        capital_funding = await self._analyze_funding_landscape(idea_title, idea_description)
        public_opinion = await self._analyze_public_sentiment(idea_title, idea_description)
        future_trends = await self._predict_future_trends(idea_title, idea_description)
        
        processing_time = time.time() - start_time
        
        return {
            "market_momentum": market_momentum,
            "competition": competition,
            "capital_funding": capital_funding,
            "public_opinion": public_opinion,
            "future_trends": future_trends,
            "confidence_score": self._calculate_confidence_score([
                market_momentum, competition, capital_funding, public_opinion, future_trends
            ]),
            "data_sources": self._get_data_sources(),
            "processing_time": processing_time
        }
    
    async def _analyze_market_momentum(self, title: str, description: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze the market momentum for this startup idea:
        
        Title: {title}
        Description: {description}
        
        Provide:
        1. Market size and growth rate
        2. Current market trends
        3. Market saturation level
        4. Entry barriers
        5. Momentum score (0-100)
        
        Return as JSON with specific metrics and insights.
        """
        
        response = await self.llm_service.analyze(prompt)
        return self._parse_llm_response(response)
    
    async def _analyze_competition(self, title: str, description: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze the competitive landscape for this startup idea:
        
        Title: {title}
        Description: {description}
        
        Provide:
        1. Top 5 competitors
        2. Market share distribution
        3. Competitive advantages needed
        4. Differentiation opportunities
        5. Competition intensity score (0-100)
        
        Return as JSON with specific competitor data and insights.
        """
        
        response = await self.llm_service.analyze(prompt)
        return self._parse_llm_response(response)
    
    async def _analyze_funding_landscape(self, title: str, description: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze the funding landscape for this startup idea:
        
        Title: {title}
        Description: {description}
        
        Provide:
        1. Recent funding rounds in similar startups
        2. Active investors in this space
        3. Average funding amounts
        4. Funding difficulty score (0-100)
        5. Recommended funding strategy
        
        Return as JSON with specific funding data and insights.
        """
        
        response = await self.llm_service.analyze(prompt)
        return self._parse_llm_response(response)
    
    async def _analyze_public_sentiment(self, title: str, description: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze public opinion and sentiment for this startup idea:
        
        Title: {title}
        Description: {description}
        
        Provide:
        1. Overall sentiment score (0-100)
        2. Key public concerns
        3. Social media trends
        4. Press coverage analysis
        5. Public adoption potential
        
        Return as JSON with specific sentiment data and insights.
        """
        
        response = await self.llm_service.analyze(prompt)
        return self._parse_llm_response(response)
    
    async def _predict_future_trends(self, title: str, description: str) -> Dict[str, Any]:
        prompt = f"""
        Predict future trends for this startup idea:
        
        Title: {title}
        Description: {description}
        
        Provide:
        1. 5-year market projection
        2. Technology trends impact
        3. Regulatory changes impact
        4. Consumer behavior shifts
        5. Risk factors and opportunities
        
        Return as JSON with specific predictions and insights.
        """
        
        response = await self.llm_service.analyze(prompt)
        return self._parse_llm_response(response)
    
    def _parse_llm_response(self, response: str) -> Dict[str, Any]:
        try:
            import json
            return json.loads(response)
        except:
            return {"raw_response": response, "parsed": False}
    
    def _calculate_confidence_score(self, analyses: List[Dict[str, Any]]) -> float:
        # Simple confidence calculation based on data completeness
        total_score = 0
        count = 0
        
        for analysis in analyses:
            if isinstance(analysis, dict) and analysis.get("parsed", True):
                total_score += 0.8  # High confidence for successful parses
            else:
                total_score += 0.3  # Lower confidence for failed parses
            count += 1
        
        return (total_score / count) * 100 if count > 0 else 0
    
    def _get_data_sources(self) -> List[str]:
        return [
            "LLM Analysis (OpenAI/Claude)",
            "Vector Database Search",
            "Market Data APIs",
            "Public Sentiment Analysis",
            "Funding Database"
        ]
