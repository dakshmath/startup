from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.services.auth import get_current_user
from app.models.user import User
from app.services.llm_service import LLMService

router = APIRouter(tags=["chat"])

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    idea_id: Optional[int] = None

class ChatResponse(BaseModel):
    message: str
    role: str = "assistant"

@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Process a chat message using LLM"""
    
    try:
        llm_service = LLMService()
        
        # Build conversation context
        conversation_context = []
        for msg in request.messages:
            conversation_context.append({
                "role": msg.role,
                "content": msg.content
            })
        
        # Create the full prompt for OpenAI
        system_prompt = """You are a world-class market intelligence analyst and startup advisor. You help entrepreneurs analyze their business ideas with deep insights about:

1. Market potential and size
2. Competitive landscape
3. Target audience analysis
4. Revenue model suggestions
5. Key risks and challenges
6. Go-to-market strategy
7. Technology requirements
8. Funding requirements

Provide thoughtful, detailed responses that help users refine their idea. Ask follow-up questions when the idea lacks sufficient detail. Be encouraging but realistic.

If the user provides a detailed idea with sufficient information, suggest they can "Run Deep Research" for comprehensive analysis."""

        # Use OpenAI's chat format directly
        messages = [
            {"role": "system", "content": system_prompt}
        ] + conversation_context
        
        # Get response from LLM
        response = await llm_service._call_openai(
            messages=messages,
            model="gpt-4"
        )
        
        return ChatResponse(
            message=response,
            role="assistant"
        )
        
    except Exception as e:
        print(f"Chat API error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process message: {str(e)}"
        )

@router.get("/history")
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat history for the current user"""
    # TODO: Implement chat history storage
    return {"messages": []}
