from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from datetime import datetime, timezone
import uuid

from models.event import Event, EventCreate
from services.database import db
from routes.auth import get_current_user

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("", response_model=Event)
async def create_event(event_data: EventCreate, current_user: dict = Depends(get_current_user)):
    """Create a new event (blocks time)"""
    # Verify user is lawyer or firm_lawyer
    if current_user.get('user_type') not in ['lawyer', 'firm_lawyer']:
        raise HTTPException(status_code=403, detail='Only lawyers can create events')

    event_dict = event_data.model_dump()
    event_dict['lawyer_id'] = current_user['id']
    
    event_obj = Event(**event_dict)
    
    # Store dates as ISO strings (or datetime objects if db service handles it)
    doc = event_obj.model_dump()
    doc['start_time'] = doc['start_time'].isoformat()
    doc['end_time'] = doc['end_time'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.events.insert_one(doc)
    return event_obj

@router.get("", response_model=List[Event])
async def get_events(current_user: dict = Depends(get_current_user)):
    """Get events for current user"""
    user_id = current_user['id']
    
    # Fetch events where lawyer_id is user_id
    events = await db.events.find({"lawyer_id": user_id}).to_list(100)
    
    for event in events:
         if isinstance(event.get('start_time'), str):
            dt_str = event['start_time'].replace('Z', '+00:00') if event['start_time'].endswith('Z') else event['start_time']
            event['start_time'] = datetime.fromisoformat(dt_str)
         if isinstance(event.get('end_time'), str):
            dt_str = event['end_time'].replace('Z', '+00:00') if event['end_time'].endswith('Z') else event['end_time']
            event['end_time'] = datetime.fromisoformat(dt_str)
         if isinstance(event.get('created_at'), str):
            dt_str = event['created_at'].replace('Z', '+00:00') if event['created_at'].endswith('Z') else event['created_at']
            event['created_at'] = datetime.fromisoformat(dt_str)

    return events

@router.delete("/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an event"""
    result = await db.events.delete_one({
        "id": event_id,
        "lawyer_id": current_user['id']
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found or unauthorized")
        
    return {"message": "Event deleted successfully"}
