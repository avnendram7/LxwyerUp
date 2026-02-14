from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from datetime import datetime, timezone
import uuid

from models.network import NetworkMessage, NetworkMessageCreate
from models.user import User
from services.database import db
from routes.auth import get_current_user

router = APIRouter(prefix="/network", tags=["Network"])

@router.get("/messages", response_model=List[dict])
async def get_network_messages(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(50, ge=1, le=100)
):
    """Get messages for the user's state network"""
    user_state = current_user.get("state")
    
    # If user has no state (e.g. admin or old account), default to 'Delhi' or handle error
    # For now, let's make it optional but preferred
    if not user_state:
        # Check if it's a dummy user, assign a default state
        if current_user["id"].startswith("dummy_"):
            user_state = "Delhi"
        else:
            # If real user but no state, maybe return empty or error?
            # Let's return empty for now to avoid breaking UI
            return []
            
    # Fetch messages for this state
    cursor = db.network_messages.find({"state": user_state}).sort("timestamp", -1).limit(limit)
    messages = await cursor.to_list(length=limit)
    
    # Convert ObjectId to str if needed (though we use UUID strings for IDs usually)
    # Our models use 'id' as str UUID, so we should be good if we inserted correctly.
    # But mongo might add _id.
    
    result = []
    for msg in messages:
        if "_id" in msg:
            del msg["_id"]
        result.append(msg)
        
    return result

@router.post("/messages")
async def send_network_message(
    message_data: NetworkMessageCreate,
    current_user: dict = Depends(get_current_user)
):
    """Send a message to the user's state network"""
    user_state = current_user.get("state")
    
    if not user_state:
         if current_user["id"].startswith("dummy_"):
            user_state = "Delhi"
         else:
            raise HTTPException(status_code=400, detail="User state not defined. Cannot send message.")

    new_message = NetworkMessage(
        sender_id=current_user["id"],
        sender_name=current_user.get("full_name", "Unknown Lawyer"),
        sender_type=current_user.get("user_type", "lawyer"),
        state=user_state,
        content=message_data.content
    )
    
    await db.network_messages.insert_one(new_message.model_dump())
    
    return {"message": "Message sent", "data": new_message.model_dump()}
