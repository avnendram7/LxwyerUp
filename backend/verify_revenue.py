
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import asyncio
from httpx import AsyncClient, ASGITransport

# Add backend directory to path
ROOT_DIR = Path(__file__).parent
sys.path.insert(0, str(ROOT_DIR))

# Load environment variables
load_dotenv(ROOT_DIR / '.env')

# Import app after loading env
from server import app
import uuid

async def verify_revenue():
    print("🚀 Starting Revenue Verification (Async)...")
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register Lawyer
        lawyer_email = f"lawyer_{uuid.uuid4()}@example.com"
        lawyer_password = "password123"
        lawyer_data = {
            "email": lawyer_email,
            "password": lawyer_password,
            "full_name": "Test Lawyer",
            "user_type": "lawyer"
        }
        
        print(f"Creating Lawyer: {lawyer_email}")
        res = await client.post("/api/auth/register", json=lawyer_data)
        if res.status_code != 200:
            print(f"❌ Failed to register lawyer: {res.text}")
            return
            
        # Login Lawyer
        login_data = {"email": lawyer_email, "password": lawyer_password, "user_type": "lawyer"}
        res = await client.post("/api/auth/login", json=login_data)
        if res.status_code != 200:
            print(f"❌ Failed to login lawyer: {res.text}")
            return
        lawyer_token = res.json()["token"]
        
        # Get Lawyer ID
        res = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {lawyer_token}"})
        lawyer_id = res.json()["id"]
        print(f"✅ Lawyer Created (ID: {lawyer_id})")
        
        # 2. Register Client
        client_email = f"client_{uuid.uuid4()}@example.com"
        client_password = "password123"
        client_data = {
            "email": client_email,
            "password": client_password,
            "full_name": "Test Client",
            "user_type": "client"
        }
        
        print(f"Creating Client: {client_email}")
        res = await client.post("/api/auth/register", json=client_data)
        if res.status_code != 200:
            print(f"❌ Failed to register client: {res.text}")
            return
            
        # Login Client
        login_data = {"email": client_email, "password": client_password, "user_type": "client"}
        res = await client.post("/api/auth/login", json=login_data)
        if res.status_code != 200:
            print(f"❌ Failed to login client: {res.text}")
            return
        client_token = res.json()["token"]
        print(f"✅ Client Created")
        
        # 3. Create Bookings
        bookings = [
            {"lawyer_id": lawyer_id, "date": "2023-10-27", "time": "10:00 AM", "description": "Consultation 1", "price": 500.0},
            {"lawyer_id": lawyer_id, "date": "2023-10-28", "time": "02:00 PM", "description": "Consultation 2", "price": 1000.0}
        ]
        
        print("Creating Bookings...")
        for b in bookings:
            res = await client.post("/api/bookings", json=b, headers={"Authorization": f"Bearer {client_token}"})
            if res.status_code != 200:
                print(f"❌ Failed to create booking: {res.text}")
                return
        print(f"✅ Created {len(bookings)} bookings with total price 1500.0")
                
        # 4. Verify Revenue
        print("Verifying Revenue...")
        res = await client.get("/api/dashboard/lawyer", headers={"Authorization": f"Bearer {lawyer_token}"})
        if res.status_code != 200:
            print(f"❌ Failed to get dashboard: {res.text}")
            return
            
        data = res.json()
        revenue = data["stats"]["revenue"]
        
        if revenue == 1500.0:
            print(f"✅ SUCCESS: Revenue is {revenue}")
        else:
            print(f"❌ FAILURE: Revenue is {revenue}, expected 1500.0")

if __name__ == "__main__":
    asyncio.run(verify_revenue())
