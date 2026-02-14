from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
import uuid
from models.booking import Booking, BookingCreate
from services.database import db
from routes.auth import get_current_user
from .notifications import create_notification

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("/guest", response_model=dict)
async def create_guest_booking(booking_data: dict):
    """Create a booking without authentication (for first-time users)"""
    booking_id = str(uuid.uuid4())
    
    booking_doc = {
        'id': booking_id,
        'fullName': booking_data.get('fullName'),
        'email': booking_data.get('email'),
        'phone': booking_data.get('phone'),
        'consultationType': booking_data.get('consultationType'),
        'date': booking_data.get('date'),
        'time': booking_data.get('time'),
        'description': booking_data.get('description', ''),
        'amount': booking_data.get('amount'),
        'status': booking_data.get('status', 'confirmed'),
        'payment_status': booking_data.get('payment_status', 'paid'),
        'payment_method': booking_data.get('payment_method', 'card'),
        'card_last_four': booking_data.get('card_last_four', ''),
        'created_at': datetime.utcnow().isoformat(),
        'client_id': None  # Will be linked when user signs up
    }
    
    await db.bookings.insert_one(booking_doc)
    return {'id': booking_id, 'message': 'Booking created successfully'}


@router.post("", response_model=Booking)
async def create_booking(booking_data: BookingCreate, current_user: dict = Depends(get_current_user)):
    """Create a new booking"""
    if current_user.get('user_type') != 'client':
        raise HTTPException(status_code=403, detail='Only clients can book consultations')
    
    # Check for free trial eligibility
    previous_bookings_count = await db.bookings.count_documents({
        "client_id": current_user['id'],
        "is_free_trial": True
    })
    
    is_free_trial = False
    price = booking_data.price
    from datetime import timedelta
    
    # CONFLICT CHECKING
    try:
        # Parse booking start time
        # Handle time formats "HH:MM" or "HH:MM AM/PM"
        time_str = booking_data.time.strip()
        date_str = booking_data.date
        
        try:
             # Try 24hr format first
             start_dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        except ValueError:
             # Try 12hr format
             start_dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %I:%M %p")
             
        end_dt = start_dt + timedelta(minutes=booking_data.duration_minutes)
        
        # Check against Events
        conflict_event = await db.events.find_one({
            "lawyer_id": booking_data.lawyer_id,
            "start_time": {"$lt": end_dt.isoformat()},
            "end_time": {"$gt": start_dt.isoformat()}
        })
        
        if conflict_event:
            raise HTTPException(status_code=400, detail="Lawyer is not available at this time (Calendar Conflict)")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error checking conflicts: {e}")
        # If date parsing fails, proceed but log the warning
        pass

    if previous_bookings_count < 3:
        is_free_trial = True
        price = 0.0
    else:
        # Pricing logic based on duration
        if price == 0.0:
            if booking_data.duration_minutes <= 30:
                price = 500.0
            elif booking_data.duration_minutes <= 60:
                price = 1000.0
            else:
                price = 1500.0

    # Determine Location based on Consultation Type
    location = ""
    meet_link = ""
    
    if booking_data.consultation_type == 'video':
        meet_link = f"https://meet.google.com/{uuid.uuid4().hex[:3]}-{uuid.uuid4().hex[:4]}-{uuid.uuid4().hex[:3]}"
        location = "Google Meet"
    elif booking_data.consultation_type == 'audio':
        location = "831216968" # Dummy number as requested
    elif booking_data.consultation_type == 'in_person':
        # Fetch Lawyer's Address
        lawyer = await db.users.find_one({"id": booking_data.lawyer_id})
        if lawyer and 'office_address' in lawyer:
            location = lawyer['office_address']
        elif lawyer and 'city' in lawyer:
            location = f"{lawyer['city']}, {lawyer.get('state', '')}"
        else:
            location = "Lawyer's Office (Address pending)"
            
    booking_dict = booking_data.model_dump()
    booking_dict['client_id'] = current_user['id']
    booking_dict['price'] = price
    booking_dict['meet_link'] = meet_link
    booking_dict['location'] = location
    booking_dict['is_free_trial'] = is_free_trial
    
    booking_obj = Booking(**booking_dict)

    
    doc = booking_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    
    # Notify Lawyer
    await create_notification(
        user_id=booking_data.lawyer_id,
        title="New Consultation Request",
        message=f"You have a new consultation request for {booking_data.date} at {booking_data.time}.",
        n_type="booking_request",
        related_id=booking_obj.id
    )
    
    return booking_obj


@router.get("", response_model=List[Booking])
async def get_bookings(current_user: dict = Depends(get_current_user)):
    """Get bookings for current user"""
    if current_user['user_type'] == 'client':
        bookings = await db.bookings.find({'client_id': current_user['id']}, {'_id': 0}).to_list(100)
    else:
        bookings = await db.bookings.find({'lawyer_id': current_user['id']}, {'_id': 0}).to_list(100)
    
    for booking in bookings:
        if isinstance(booking['created_at'], str):
            dt_str = booking['created_at'].replace('Z', '+00:00') if booking['created_at'].endswith('Z') else booking['created_at']
            booking['created_at'] = datetime.fromisoformat(dt_str)
    
    return bookings


@router.patch("/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str, current_user: dict = Depends(get_current_user)):
    """Update booking status (lawyers only)"""
    if current_user['user_type'] != 'lawyer':
        raise HTTPException(status_code=403, detail='Only lawyers can update booking status')
    
    result = await db.bookings.update_one(
        {'id': booking_id, 'lawyer_id': current_user['id']},
        {'$set': {'status': status}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail='Booking not found')
    
    # Get booking to find client_id
    booking = await db.bookings.find_one({'id': booking_id})
    if booking:
        title = "Consultation Accepted" if status == 'confirmed' else f"Consultation Status: {status}"
        message = f"Your consultation for {booking['date']} has been {status}."
        await create_notification(
            user_id=booking['client_id'],
            title=title,
            message=message,
            n_type=f"booking_{status}",
            related_id=booking_id
        )
    
    return {'success': True}

@router.patch("/{booking_id}/reschedule")
async def reschedule_booking(booking_id: str, date: str, time: str, current_user: dict = Depends(get_current_user)):
    """Reschedule a booking (lawyers only)"""
    if current_user['user_type'] != 'lawyer':
        raise HTTPException(status_code=403, detail='Only lawyers can reschedule consultations')
    
    result = await db.bookings.update_one(
        {'id': booking_id, 'lawyer_id': current_user['id']},
        {'$set': {'date': date, 'time': time, 'status': 'rescheduled'}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail='Booking not found')
    
    booking = await db.bookings.find_one({'id': booking_id})
    if booking:
        await create_notification(
            user_id=booking['client_id'],
            title="Consultation Rescheduled",
            message=f"Your consultation has been rescheduled to {date} at {time}.",
            n_type="booking_rescheduled",
            related_id=booking_id
        )
        
    return {'success': True}

@router.patch("/{booking_id}/cancel")
async def cancel_booking(booking_id: str, reason: str = "", current_user: dict = Depends(get_current_user)):
    """Cancel a booking (lawyers or clients)"""
    # Logic for both lawyer and client
    query = {'id': booking_id}
    if current_user['user_type'] == 'lawyer':
        query['lawyer_id'] = current_user['id']
    else:
        query['client_id'] = current_user['id']
        
    result = await db.bookings.update_one(
        query,
        {'$set': {'status': 'cancelled', 'cancel_reason': reason}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail='Booking not found')
    
    booking = await db.bookings.find_one({'id': booking_id})
    if booking:
        # Notify the other party
        target_user_id = booking['client_id'] if current_user['user_type'] == 'lawyer' else booking['lawyer_id']
        await create_notification(
            user_id=target_user_id,
            title="Consultation Cancelled",
            message=f"Consultation for {booking['date']} has been cancelled. {f'Reason: {reason}' if reason else ''}",
            n_type="booking_cancelled",
            related_id=booking_id
        )
        
    return {'success': True}

