"""
Firm Lawyers API Backend Tests
Tests for: Firm Lawyer CRUD, Tasks, Reports, Login
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test firm data
TEST_FIRM_ID = f"test_firm_{uuid.uuid4().hex[:8]}"
TEST_FIRM_NAME = "Test Law Associates"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestFirmLawyersEndpoints:
    """Tests for /api/firm-lawyers endpoints"""
    
    def test_get_firm_lawyers_empty(self, api_client):
        """Test GET /api/firm-lawyers/by-firm/{firm_id} returns empty list for new firm"""
        response = api_client.get(f"{BASE_URL}/api/firm-lawyers/by-firm/{TEST_FIRM_ID}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Firm lawyers for {TEST_FIRM_ID}: {len(data)} lawyers")
    
    def test_get_firm_report_empty(self, api_client):
        """Test GET /api/firm-lawyers/reports/firm/{firm_id} returns empty report for new firm"""
        response = api_client.get(f"{BASE_URL}/api/firm-lawyers/reports/firm/{TEST_FIRM_ID}")
        assert response.status_code == 200
        data = response.json()
        assert "total_lawyers" in data
        assert "total_tasks" in data
        assert "completed_tasks" in data
        assert "pending_tasks" in data
        assert "completion_rate" in data
        assert "lawyer_stats" in data
        assert "lawyers" in data
        print(f"Firm report: {data['total_lawyers']} lawyers, {data['total_tasks']} tasks")
    
    def test_get_nonexistent_lawyer(self, api_client):
        """Test GET /api/firm-lawyers/{lawyer_id} returns 404 for nonexistent lawyer"""
        response = api_client.get(f"{BASE_URL}/api/firm-lawyers/nonexistent-lawyer-id")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
    
    def test_get_lawyer_tasks_empty(self, api_client):
        """Test GET /api/firm-lawyers/tasks/by-lawyer/{lawyer_id} returns empty list"""
        response = api_client.get(f"{BASE_URL}/api/firm-lawyers/tasks/by-lawyer/nonexistent-lawyer")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_firm_tasks_empty(self, api_client):
        """Test GET /api/firm-lawyers/tasks/by-firm/{firm_id} returns empty list for new firm"""
        response = api_client.get(f"{BASE_URL}/api/firm-lawyers/tasks/by-firm/{TEST_FIRM_ID}")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestFirmLawyerLogin:
    """Tests for firm lawyer login endpoint"""
    
    def test_login_invalid_credentials(self, api_client):
        """Test POST /api/firm-lawyers/login with invalid credentials returns 401"""
        response = api_client.post(f"{BASE_URL}/api/firm-lawyers/login", json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
    
    def test_login_via_auth_endpoint_invalid_type(self, api_client):
        """Test POST /api/auth/login with firm_lawyer type returns 422 (not supported via main auth)"""
        # Note: firm_lawyer uses separate /api/firm-lawyers/login endpoint
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "wrongpassword",
            "user_type": "firm_lawyer"
        })
        # firm_lawyer is not a valid user_type for main auth endpoint
        assert response.status_code == 422


class TestLawFirmsEndpoint:
    """Tests for /api/lawfirms endpoint"""
    
    def test_get_lawfirms_list(self, api_client):
        """Test GET /api/lawfirms returns list of law firms"""
        response = api_client.get(f"{BASE_URL}/api/lawfirms")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} law firms")
        
        # If law firms exist, verify structure
        if len(data) > 0:
            firm = data[0]
            assert "email" in firm
            assert "firm_name" in firm or "full_name" in firm
            assert firm.get("user_type") == "law_firm"


class TestHealthAndBasicEndpoints:
    """Basic health and endpoint tests"""
    
    def test_health_check(self, api_client):
        """Test /api/health returns healthy status"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
    
    def test_lawyers_list(self, api_client):
        """Test GET /api/lawyers returns list"""
        response = api_client.get(f"{BASE_URL}/api/lawyers")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
