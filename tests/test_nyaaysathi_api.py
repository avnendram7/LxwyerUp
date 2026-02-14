"""
Nyaay Sathi API Backend Tests
Tests for: Auth (login/register), Cases, Documents, Bookings, Lawyers, Chat
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from requirements
LAWYER_CREDS = {"email": "testlawyer@example.com", "password": "password123", "user_type": "lawyer"}
CLIENT_CREDS = {"email": "newuser@example.com", "password": "password123", "user_type": "client"}

# Generate unique test emails for registration tests
TEST_LAWYER_EMAIL = f"test_lawyer_{uuid.uuid4().hex[:8]}@example.com"
TEST_CLIENT_EMAIL = f"test_client_{uuid.uuid4().hex[:8]}@example.com"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self, api_client):
        """Test /api/health returns healthy status"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "Nyaay Sathi API"


class TestAuthEndpoints:
    """Authentication endpoint tests - login and register"""
    
    def test_register_new_lawyer(self, api_client):
        """Test lawyer registration"""
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_LAWYER_EMAIL,
            "password": "password123",
            "full_name": "Test Lawyer",
            "user_type": "lawyer",
            "phone": "9876543210"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_LAWYER_EMAIL
        assert data["user"]["user_type"] == "lawyer"
    
    def test_register_new_client(self, api_client):
        """Test client registration"""
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_CLIENT_EMAIL,
            "password": "password123",
            "full_name": "Test Client",
            "user_type": "client",
            "phone": "9876543211"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_CLIENT_EMAIL
        assert data["user"]["user_type"] == "client"
    
    def test_register_duplicate_user(self, api_client):
        """Test duplicate registration returns 400"""
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": TEST_LAWYER_EMAIL,
            "password": "password123",
            "full_name": "Test Lawyer Duplicate",
            "user_type": "lawyer"
        })
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
    
    def test_login_lawyer_success(self, api_client):
        """Test lawyer login with valid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=LAWYER_CREDS)
        # May return 401 if user doesn't exist, or 200 if exists
        if response.status_code == 200:
            data = response.json()
            assert "token" in data
            assert "user" in data
            assert data["user"]["user_type"] == "lawyer"
        else:
            # User may not exist yet, try with newly registered user
            response = api_client.post(f"{BASE_URL}/api/auth/login", json={
                "email": TEST_LAWYER_EMAIL,
                "password": "password123",
                "user_type": "lawyer"
            })
            assert response.status_code == 200
            data = response.json()
            assert "token" in data
    
    def test_login_client_success(self, api_client):
        """Test client login with valid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=CLIENT_CREDS)
        if response.status_code == 200:
            data = response.json()
            assert "token" in data
            assert "user" in data
            assert data["user"]["user_type"] == "client"
        else:
            # User may not exist yet, try with newly registered user
            response = api_client.post(f"{BASE_URL}/api/auth/login", json={
                "email": TEST_CLIENT_EMAIL,
                "password": "password123",
                "user_type": "client"
            })
            assert response.status_code == 200
            data = response.json()
            assert "token" in data
    
    def test_login_invalid_credentials(self, api_client):
        """Test login with invalid credentials returns 401"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword",
            "user_type": "client"
        })
        assert response.status_code == 401


class TestAuthenticatedEndpoints:
    """Tests for endpoints requiring authentication"""
    
    @pytest.fixture(scope="class")
    def lawyer_token(self, api_client):
        """Get lawyer authentication token"""
        # Try existing credentials first
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=LAWYER_CREDS)
        if response.status_code == 200:
            return response.json()["token"]
        
        # Register new lawyer if not exists
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": f"lawyer_{uuid.uuid4().hex[:8]}@example.com",
            "password": "password123",
            "full_name": "Test Lawyer Auth",
            "user_type": "lawyer"
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate lawyer")
    
    @pytest.fixture(scope="class")
    def client_token(self, api_client):
        """Get client authentication token"""
        # Try existing credentials first
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=CLIENT_CREDS)
        if response.status_code == 200:
            return response.json()["token"]
        
        # Register new client if not exists
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": f"client_{uuid.uuid4().hex[:8]}@example.com",
            "password": "password123",
            "full_name": "Test Client Auth",
            "user_type": "client"
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate client")
    
    def test_get_me_lawyer(self, api_client, lawyer_token):
        """Test /api/auth/me for lawyer"""
        headers = {"Authorization": f"Bearer {lawyer_token}"}
        response = api_client.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["user_type"] == "lawyer"
    
    def test_get_me_client(self, api_client, client_token):
        """Test /api/auth/me for client"""
        headers = {"Authorization": f"Bearer {client_token}"}
        response = api_client.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["user_type"] == "client"
    
    def test_get_cases_lawyer(self, api_client, lawyer_token):
        """Test GET /api/cases for lawyer"""
        headers = {"Authorization": f"Bearer {lawyer_token}"}
        response = api_client.get(f"{BASE_URL}/api/cases", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_cases_client(self, api_client, client_token):
        """Test GET /api/cases for client"""
        headers = {"Authorization": f"Bearer {client_token}"}
        response = api_client.get(f"{BASE_URL}/api/cases", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_bookings_lawyer(self, api_client, lawyer_token):
        """Test GET /api/bookings for lawyer"""
        headers = {"Authorization": f"Bearer {lawyer_token}"}
        response = api_client.get(f"{BASE_URL}/api/bookings", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_bookings_client(self, api_client, client_token):
        """Test GET /api/bookings for client"""
        headers = {"Authorization": f"Bearer {client_token}"}
        response = api_client.get(f"{BASE_URL}/api/bookings", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_get_documents_client(self, api_client, client_token):
        """Test GET /api/documents for client"""
        headers = {"Authorization": f"Bearer {client_token}"}
        response = api_client.get(f"{BASE_URL}/api/documents", headers=headers)
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestLawyersEndpoint:
    """Tests for lawyers listing endpoint"""
    
    def test_get_lawyers_list(self, api_client):
        """Test GET /api/lawyers returns list of lawyers"""
        response = api_client.get(f"{BASE_URL}/api/lawyers")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # If lawyers exist, verify structure
        if len(data) > 0:
            lawyer = data[0]
            assert "email" in lawyer
            assert "full_name" in lawyer
            assert lawyer["user_type"] == "lawyer"
            assert "password" not in lawyer  # Password should be excluded


class TestWaitlistEndpoint:
    """Tests for waitlist endpoint"""
    
    def test_join_waitlist(self, api_client):
        """Test POST /api/waitlist"""
        unique_email = f"waitlist_{uuid.uuid4().hex[:8]}@example.com"
        response = api_client.post(f"{BASE_URL}/api/waitlist", json={
            "email": unique_email,
            "full_name": "Waitlist User",
            "message": "Interested in the platform"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == unique_email
        assert data["full_name"] == "Waitlist User"
    
    def test_join_waitlist_duplicate(self, api_client):
        """Test duplicate waitlist registration returns 400"""
        unique_email = f"waitlist_dup_{uuid.uuid4().hex[:8]}@example.com"
        # First registration
        api_client.post(f"{BASE_URL}/api/waitlist", json={
            "email": unique_email,
            "full_name": "Waitlist User"
        })
        # Duplicate registration
        response = api_client.post(f"{BASE_URL}/api/waitlist", json={
            "email": unique_email,
            "full_name": "Waitlist User Duplicate"
        })
        assert response.status_code == 400


class TestCaseCRUD:
    """Tests for case CRUD operations"""
    
    @pytest.fixture(scope="class")
    def client_auth(self, api_client):
        """Get client authentication"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json=CLIENT_CREDS)
        if response.status_code == 200:
            return response.json()["token"]
        
        # Register new client
        response = api_client.post(f"{BASE_URL}/api/auth/register", json={
            "email": f"case_client_{uuid.uuid4().hex[:8]}@example.com",
            "password": "password123",
            "full_name": "Case Test Client",
            "user_type": "client"
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not authenticate for case tests")
    
    def test_create_case(self, api_client, client_auth):
        """Test creating a new case"""
        headers = {"Authorization": f"Bearer {client_auth}"}
        case_data = {
            "title": f"TEST_Case_{uuid.uuid4().hex[:8]}",
            "case_number": f"CASE-{uuid.uuid4().hex[:6].upper()}",
            "description": "Test case for property dispute",
            "status": "active"
        }
        response = api_client.post(f"{BASE_URL}/api/cases", json=case_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == case_data["title"]
        assert data["case_number"] == case_data["case_number"]
        assert "id" in data
        
        # Verify case was persisted by fetching it
        case_id = data["id"]
        get_response = api_client.get(f"{BASE_URL}/api/cases/{case_id}", headers=headers)
        assert get_response.status_code == 200
        fetched_case = get_response.json()
        assert fetched_case["title"] == case_data["title"]


class TestUnauthorizedAccess:
    """Tests for unauthorized access scenarios"""
    
    def test_cases_without_auth(self, api_client):
        """Test accessing cases without authentication"""
        response = api_client.get(f"{BASE_URL}/api/cases")
        assert response.status_code in [401, 403]
    
    def test_bookings_without_auth(self, api_client):
        """Test accessing bookings without authentication"""
        response = api_client.get(f"{BASE_URL}/api/bookings")
        assert response.status_code in [401, 403]
    
    def test_documents_without_auth(self, api_client):
        """Test accessing documents without authentication"""
        response = api_client.get(f"{BASE_URL}/api/documents")
        assert response.status_code in [401, 403]
    
    def test_auth_me_without_token(self, api_client):
        """Test /api/auth/me without token"""
        response = api_client.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code in [401, 403]


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
