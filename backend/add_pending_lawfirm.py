#!/usr/bin/env python3
"""
Add a pending law firm application for admin approval
"""

import asyncio
import os
import sys
from pathlib import Path
from datetime import datetime, timezone
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Add backend to path
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / '.env')

from services.auth import hash_password

# Database connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]


async def add_pending_lawfirm():
    """Add a new pending law firm application"""
    
    print("=" * 60)
    print("🏢 ADDING NEW LAW FIRM APPLICATION")
    print("=" * 60)
    
    # New law firm data
    lawfirm = {
        "id": str(uuid.uuid4()),
        "email": "contact@singhassociates.com",
        "password_hash": hash_password("LawFirm@123"),
        "firm_name": "Singh & Associates Legal Consultants",
        "phone": "+91 9876543215",
        "address": "Plot 77, Sector 44, Golf Course Road, Gurugram - 122002",
        "city": "Gurugram",
        "state": "Haryana",
        "specialization": ["Corporate Law", "Mergers & Acquisitions", "Contract Law", "Banking Law"],
        "bar_council_registration": "GGN/2016/88990",
        "established_year": 2016,
        "total_lawyers": 18,
        "website": "www.singhassociates.com",
        "description": "A full-service corporate law firm specializing in M&A, banking, and commercial transactions. We serve startups, SMEs, and large corporations across India.",
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    try:
        # Check if already exists
        existing = await db.lawfirm_applications.find_one({"email": lawfirm["email"]})
        if existing:
            print("⚠️  Application already exists!")
            print(f"   Email: {lawfirm['email']}")
            print(f"   Status: {existing.get('status')}")
            return
        
        # Insert the application
        await db.lawfirm_applications.insert_one(lawfirm)
        
        print("\n✅ LAW FIRM APPLICATION CREATED!")
        print("\n📋 APPLICATION DETAILS:")
        print(f"   Firm Name: {lawfirm['firm_name']}")
        print(f"   Email: {lawfirm['email']}")
        print("   Password: LawFirm@123")
        print(f"   Location: {lawfirm['city']}, {lawfirm['state']}")
        print(f"   Specialization: {', '.join(lawfirm['specialization'])}")
        print(f"   Established: {lawfirm['established_year']}")
        print(f"   Total Lawyers: {lawfirm['total_lawyers']}")
        print(f"   Bar Council: {lawfirm['bar_council_registration']}")
        print(f"   Status: {lawfirm['status']}")
        
        print("\n📝 NEXT STEPS:")
        print("   1. Login to Admin Dashboard")
        print("   2. Navigate to 'Law Firms' section")
        print("   3. Find and approve this application")
        print("   4. After approval, login with:")
        print(f"      Email: {lawfirm['email']}")
        print("      Password: LawFirm@123")
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(add_pending_lawfirm())
