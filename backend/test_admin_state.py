import requests

BASE_URL = "http://localhost:8000/api"

def test_admin_state_management():
    # 1. Admin Login
    print("Logging in as Admin...")
    resp = requests.post(f"{BASE_URL}/admin/login", json={
        "email": "admin@lxwyerup.com",
        "password": "admin123"
    })
    if resp.status_code != 200:
        print("Admin login failed:", resp.text)
        return
    admin_token = resp.json()["token"]
    print("Admin logged in.")

    # 2. Get Lawyers
    print("Fetching approved lawyers...")
    headers = {"Authorization": f"Bearer {admin_token}"}
    resp = requests.get(f"{BASE_URL}/admin/lawyers", headers=headers)
    if resp.status_code != 200:
        print("Failed to fetch lawyers:", resp.text)
        return
    
    lawyers = resp.json()["lawyers"]
    if not lawyers:
        print("No approved lawyers found to test with.")
        return
    
    target_lawyer = lawyers[0]
    lawyer_id = target_lawyer["id"]
    print(f"Targeting lawyer: {target_lawyer.get('full_name')} (ID: {lawyer_id})")

    # 3. Update State
    new_state = "Haryana"
    print(f"Updating state to {new_state}...")
    resp = requests.put(f"{BASE_URL}/admin/lawyers/{lawyer_id}/state", 
                        headers=headers, 
                        json={"state": new_state})
    
    if resp.status_code == 200:
        print(f"✅ SUCCESS: {resp.json()['message']}")
    else:
        print(f"❌ FAILURE: {resp.status_code} - {resp.text}")

    # 4. Verify Update
    resp = requests.get(f"{BASE_URL}/admin/lawyers", headers=headers)
    updated_lawyers = resp.json()["lawyers"]
    for l in updated_lawyers:
        if l["id"] == lawyer_id:
            if l.get("state") == new_state:
                print("✅ VERIFIED: State persisted in database.")
            else:
                print(f"❌ ERROR: State is {l.get('state')}, expected {new_state}")
            break

if __name__ == "__main__":
    test_admin_state_management()
