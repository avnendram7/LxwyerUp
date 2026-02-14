from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from datetime import datetime, timezone
import uuid
from services.database import db
from routes.auth import get_current_user
from models.message import Message, MessageCreate

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.get("/recents")
async def get_recent_conversations(current_user: dict = Depends(get_current_user)):
    """
    Fetch recent conversations for the current user.
    Aggregates messages to find unique contacts and the last message exchanged.
    """
    user_id = current_user['id']
    
    # Aggregation pipeline to get recent conversations
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"sender_id": user_id},
                    {"receiver_id": user_id}
                ]
            }
        },
        {
            "$sort": {"timestamp": -1}
        },
        {
            "$group": {
                "_id": {
                    "$cond": [
                        {"$eq": ["$sender_id", user_id]},
                        "$receiver_id",
                        "$sender_id"
                    ]
                },
                "last_message": {"$first": "$$ROOT"}
            }
        },
        {
            "$replaceRoot": {"newRoot": "$last_message"}
        },
        {
            "$sort": {"timestamp": -1}
        }
    ]
    
    recent_messages = await db.messages.aggregate(pipeline).to_list(length=20)
    
    conversations = []
    for msg in recent_messages:
        other_user_id = msg['receiver_id'] if msg['sender_id'] == user_id else msg['sender_id']
        
        # Determine who the other person is
        # Try to find in users collection (lawyers, clients, etc.)
        other_user = await db.users.find_one({"id": other_user_id})
        
        # If not found in users, might be a lawyer finding a user, or vice versa
        if not other_user:
             other_user = await db.lawyers.find_one({"id": other_user_id})

        # Fallback name if not found
        name = other_user.get('full_name', 'Unknown User') if other_user else 'Unknown User'
        avatar_letter = name[0] if name else '?'
        
        conversations.append({
            "id": other_user_id,
            "name": name,
            "message": msg['content'],
            "timestamp": msg['timestamp'],
            "unread": 0, # TODO: Implement unread count
            "avatar": avatar_letter,
            "online": False # Data not available yet
        })
        
    return conversations

@router.get("/{other_user_id}")
async def get_conversation(other_user_id: str, current_user: dict = Depends(get_current_user)):
    """Fetch conversation history with a specific user"""
    user_id = current_user['id']
    
    messages = await db.messages.find({
        "$or": [
            {"sender_id": user_id, "receiver_id": other_user_id},
            {"sender_id": other_user_id, "receiver_id": user_id}
        ]
    }).sort("timestamp", 1).to_list(length=100)
    
    return messages

@router.post("", response_model=Message)
async def send_message(message_data: MessageCreate, current_user: dict = Depends(get_current_user)):
    """Send a new message"""
    new_message = Message(
        sender_id=current_user['id'],
        receiver_id=message_data.receiver_id,
        content=message_data.content
    )
    
    await db.messages.insert_one(new_message.model_dump())
    return new_message
