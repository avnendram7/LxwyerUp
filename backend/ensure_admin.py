#!/usr/bin/env python3
"""
Add admin user if not exists
"""

import asyncio
import os
import sys
from pathlib import Path
from datetime import datetime, timezone
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


async def ensure_admin():
    """Ensure admin user exists"""
    
    admin = await db.users.find_one({'user_type': 'admin'}, {'_id': 0})
    
    if admin:
        print(f"✅ Admin already exists: {admin.get('email')}")
        return admin.get('email')
    
    print("Creating admin user...")
    admin_data = {
        'id': 'admin-001',
        'email': 'admin@lxwyerup.com',
        'password': hash_password('Admin@123'),
        'full_name': 'Admin User',
        'user_type': 'admin',
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin_data)
    print("✅ Admin created: {admin_data['email']}")
    print("   Password: Admin@123")
    return admin_data['email']


if __name__ == "__main__":
    asyncio.run(ensure_admin())
