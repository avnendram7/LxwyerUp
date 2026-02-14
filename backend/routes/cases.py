from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import datetime
from models.case import Case, CaseCreate
from services.database import db
from routes.auth import get_current_user

router = APIRouter(prefix="/cases", tags=["Cases"])


@router.post("", response_model=Case)
async def create_case(case_data: CaseCreate, current_user: dict = Depends(get_current_user)):
    """Create a new case"""
    case_dict = case_data.model_dump()
    case_dict['user_id'] = current_user['id']
    case_obj = Case(**case_dict)
    
    doc = case_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.cases.insert_one(doc)
    return case_obj


@router.get("", response_model=List[Case])
async def get_cases(current_user: dict = Depends(get_current_user)):
    """Get cases for current user"""
    if current_user['user_type'] == 'client':
        cases = await db.cases.find({'user_id': current_user['id']}, {'_id': 0}).to_list(100)
    else:
        cases = await db.cases.find({}, {'_id': 0}).to_list(100)
    
    for case in cases:
        if isinstance(case['created_at'], str):
            dt_str = case['created_at'].replace('Z', '+00:00') if case['created_at'].endswith('Z') else case['created_at']
            case['created_at'] = datetime.fromisoformat(dt_str)
        if isinstance(case['updated_at'], str):
            dt_str = case['updated_at'].replace('Z', '+00:00') if case['updated_at'].endswith('Z') else case['updated_at']
            case['updated_at'] = datetime.fromisoformat(dt_str)
    
    return cases


@router.get("/{case_id}", response_model=Case)
async def get_case(case_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific case"""
    case = await db.cases.find_one({'id': case_id}, {'_id': 0})
    if not case:
        raise HTTPException(status_code=404, detail='Case not found')
    
    if isinstance(case['created_at'], str):
        dt_str = case['created_at'].replace('Z', '+00:00') if case['created_at'].endswith('Z') else case['created_at']
        case['created_at'] = datetime.fromisoformat(dt_str)
    if isinstance(case['updated_at'], str):
        dt_str = case['updated_at'].replace('Z', '+00:00') if case['updated_at'].endswith('Z') else case['updated_at']
        case['updated_at'] = datetime.fromisoformat(dt_str)
    
    return case
