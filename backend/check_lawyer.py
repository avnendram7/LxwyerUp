
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "test_database"

async def check_lawyer():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print(f"Connecting to {MONGO_URI}...")
    
    # Search for user with name containing 'Avnendra' (case insensitive)
    cursor = db.users.find({
        "full_name": {"$regex": "Avnendra", "$options": "i"},
        "user_type": "lawyer"
    })
    
    found = False
    async for user in cursor:
        found = True
        print("Found User:")
        print(user)
        print("-" * 20)
        
    if not found:
        print("No lawyer found with name 'Avnendra' in users collection.")
        
    print("\nListing ALL lawyer applications...")
    cursor = db.lawyer_applications.find({})
    
    async for app in cursor:
        print(f"  ID: {app.get('_id')}")
        print(f"  Name: {app.get('name')}")
        print(f"  Email: {app.get('email')}")
        print(f"  Status: {app.get('status')}")
        print("-" * 20)

if __name__ == "__main__":
    asyncio.run(check_lawyer())
