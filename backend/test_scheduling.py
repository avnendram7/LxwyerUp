import requests
import datetime

BASE_URL = "http://localhost:8000/api"

def test_scheduling():
    # 1. Login as Lawyer
    print("Logging in as Lawyer...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "demo@lawyer.com", 
        "password": "demo123",
        "user_type": "lawyer"
    })
    if resp.status_code != 200:
        print("Failed to login as lawyer:", resp.text)
        return
    lawyer_token = resp.json()["token"]
    lawyer_id = resp.json()["user"]["id"]
    print("Lawyer logged in.")

    # 2. Create Event (Next Month 10:00 - 11:00)
    next_month = datetime.date.today() + datetime.timedelta(days=30)
    date_str = next_month.isoformat()
    start_time = f"{date_str}T10:00:00"
    end_time = f"{date_str}T11:00:00"
    
    print(f"Creating event for {date_str} 10:00-11:00...")
    resp = requests.post(f"{BASE_URL}/events", headers={
        "Authorization": f"Bearer {lawyer_token}"
    }, json={
        "title": "Busy Time",
        "type": "meeting",
        "start_time": start_time,
        "end_time": end_time,
        "description": "Busy"
    })
    
    if resp.status_code == 200:
        print("Event created.")
    else:
        print("Failed to create event:", resp.text)
        return

    # 3. Login as Client
    print("Logging in as Client...")
    resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "demo@user.com", 
        "password": "demo123",
        "user_type": "client"
    })
    if resp.status_code != 200:
        print("Failed to login as client:", resp.text)
        # Note: If client doesn't exist, this might fail. 
        # But populate_dummy_data.py creates it.
        return
    client_token = resp.json()["token"]
    print("Client logged in.")

    # 4. Try to Book (Conflict)
    print("Attempting to book during conflict...")
    resp = requests.post(f"{BASE_URL}/bookings", headers={
        "Authorization": f"Bearer {client_token}"
    }, json={
        "lawyer_id": lawyer_id,
        "consultationType": "Video",
        "date": date_str,
        "time": "10:00",
        "duration_minutes": 60,
        "amount": 1000,
        "price": 1000,
        "description": "Test consultation"
    })
    
    if resp.status_code == 400:
        print("✅ SUCCESS: Conflict detected (400 Bad Request)")
        print(resp.json())
    else:
        print(f"❌ FAILURE: Unexpected status code {resp.status_code}")
        print(resp.text)
        
    # 5. Try to Book (No Conflict)
    print("Attempting to book clean slot (12:00)...")
    resp = requests.post(f"{BASE_URL}/bookings", headers={
        "Authorization": f"Bearer {client_token}"
    }, json={
        "lawyer_id": lawyer_id,
        "consultationType": "Video",
        "date": date_str,
        "time": "12:00",
        "duration_minutes": 60,
        "amount": 1000,
        "price": 1000,
        "description": "Test consultation clean slot"
    })
    
    if resp.status_code == 200:
        print("✅ SUCCESS: Booking created (200 OK)")
    else:
         print(f"❌ FAILURE: Unexpected status code {resp.status_code}")
         print(resp.text)

if __name__ == "__main__":
    test_scheduling()
