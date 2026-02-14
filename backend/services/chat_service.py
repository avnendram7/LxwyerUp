import os
import logging
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
from fastapi import HTTPException

# Default system prompt for legal assistant
DEFAULT_SYSTEM_PROMPT = """You are a helpful legal assistant for Lxwyer Up, an Indian legal tech platform.

IMPORTANT: Always respond in valid JSON format with this exact structure:
{
  "cards": [
    {"type": "info", "title": "Title Here", "content": "Brief content here in 2-3 lines max"},
    {"type": "advice", "title": "Another Point", "content": "More content here"}
  ]
}

CARD TYPES TO USE:
- "greeting": For welcome messages (purple color)
- "question": For asking clarification (blue color)  
- "info": For key information/facts (gray color)
- "advice": For legal guidance (green color)
- "action": For next steps to take (amber color)
- "warning": For important cautions (red color)

RULES:
- Use 2-4 cards per response
- Keep each card content brief (2-3 lines max)
- Be helpful, empathetic, and use simple language
- Mix Hindi-English if user writes in Hindi
- ONLY output valid JSON, no markdown or extra text"""


async def send_chat_message(message: str, session_id: str, system_prompt: str = None) -> str:
    """Send a message to the LLM chat and get response"""
    prompt = system_prompt if system_prompt else DEFAULT_SYSTEM_PROMPT
    
    try:
        chat_client = LlmChat(
            api_key=os.environ.get('EMERGENT_LLM_KEY'),
            session_id=session_id,
            system_message=prompt
        ).with_model('gemini', 'gemini-3-flash-preview')
        
        user_message = UserMessage(text=message)
        response = await chat_client.send_message(user_message)
        
        return response
    except Exception as e:
        logging.error(f'Chat service error: {str(e)}')
        raise HTTPException(status_code=500, detail=f'Chat service error: {str(e)}')


def generate_guest_session_id() -> str:
    """Generate a unique session ID for guest users"""
    return f"guest_{uuid.uuid4()}"
