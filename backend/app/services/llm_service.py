import openai
import anthropic
from app.core.config import settings
from typing import Optional

class LLMService:
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    async def analyze(self, prompt: str, model: str = "gpt-4") -> str:
        """Analyze using LLM with fallback options"""
        
        # Try OpenAI first
        if self.openai_client:
            try:
                response = await self._call_openai(prompt, model)
                return response
            except Exception as e:
                print(f"OpenAI API error: {e}")
        
        # Fallback to Claude
        if self.anthropic_client:
            try:
                response = await self._call_claude(prompt)
                return response
            except Exception as e:
                print(f"Claude API error: {e}")
        
        raise Exception("All LLM providers failed")
    
    async def _call_openai(self, prompt: str, model: str = "gpt-4") -> str:
        response = await self.openai_client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a market intelligence analyst. Provide detailed, data-driven insights in JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        return response.choices[0].message.content
    
    async def _call_claude(self, prompt: str) -> str:
        response = await self.anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": f"You are a market intelligence analyst. Provide detailed, data-driven insights in JSON format.\n\n{prompt}"}
            ],
            temperature=0.3
        )
        
        return response.content[0].text
    
    async def generate_embeddings(self, text: str) -> list:
        """Generate embeddings for vector search"""
        
        if self.openai_client:
            try:
                response = await self.openai_client.embeddings.create(
                    model="text-embedding-ada-002",
                    input=text
                )
                return response.data[0].embedding
            except Exception as e:
                print(f"OpenAI embedding error: {e}")
        
        raise Exception("Failed to generate embeddings")
    
    async def search_similar_ideas(self, query_embedding: list, limit: int = 5) -> list:
        """Search for similar ideas using vector similarity"""
        # This would integrate with Pinecone or Weaviate
        # For now, return empty list
        return []
