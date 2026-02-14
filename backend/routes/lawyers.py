from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from models.user import User
from models.lawyer_application import LawyerApplication, LawyerApplicationCreate
from services.database import db
from services.auth import hash_password

router = APIRouter(prefix="/lawyers", tags=["Lawyers"])


@router.get("", response_model=List[User])
async def get_lawyers():
    """Get all lawyers"""
    lawyers = await db.users.find(
        {'user_type': 'lawyer'}, 
        {'_id': 0, 'password': 0}
    ).to_list(100)
    
    for lawyer in lawyers:
        if isinstance(lawyer.get('created_at'), str):
            dt_str = lawyer['created_at'].replace('Z', '+00:00') if lawyer['created_at'].endswith('Z') else lawyer['created_at']
            lawyer['created_at'] = datetime.fromisoformat(dt_str)
        # Ensure ID is string
        lawyer['id'] = str(lawyer['_id'])
        del lawyer['_id']
    
    return lawyers


@router.post("/applications")
async def submit_lawyer_application(application: LawyerApplicationCreate):
    """Submit a lawyer application"""
    # Check if email already exists
    existing = await db.lawyer_applications.find_one({'email': application.email})
    if existing:
        raise HTTPException(status_code=400, detail='An application with this email already exists')
    
    existing_user = await db.users.find_one({'email': application.email})
    if existing_user:
        raise HTTPException(status_code=400, detail='A user with this email already exists')
    
    # Create application
    app_data = LawyerApplication(
        name=application.name,
        email=application.email,
        phone=application.phone,
        password_hash=hash_password(application.password),
        photo=application.photo,
        bar_council_number=application.bar_council_number,
        specialization=application.specialization,
        experience=application.experience,
        cases_won=application.cases_won,
        state=application.state,
        city=application.city,
        court=application.court,
        education=application.education,
        languages=application.languages,
        fee_range=application.fee_range,
        bio=application.bio,
        lawyer_type=application.lawyer_type,
        office_address=application.office_address,
        law_firm_id=application.law_firm_id,
        law_firm_name=application.law_firm_name
    )
    
    await db.lawyer_applications.insert_one(app_data.model_dump())
    return {'message': 'Application submitted successfully', 'id': app_data.id}
