import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app import main
from app.database import Base
from app.main import app


@pytest.fixture
def client(tmp_path, monkeypatch):
    engine = create_engine(
        f"sqlite:///{(tmp_path / 'test.db').as_posix()}",
        connect_args={'check_same_thread': False},
    )
    Base.metadata.create_all(bind=engine)
    test_session_local = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    monkeypatch.setattr(main, 'SessionLocal', test_session_local)

    def override_get_db():
        db = test_session_local()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[main.get_db] = override_get_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        engine.dispose()


def test_api_health(client: TestClient) -> None:
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'healthy'


def test_login_success(client: TestClient) -> None:
    response = client.post(
        '/api/auth/login',
        json={'email': 'student@aicareercoach.com', 'password': 'Password123!'},
    )
    assert response.status_code == 200
    data = response.json()
    assert 'access_token' in data
    assert data['user']['email'] == 'student@aicareercoach.com'


def test_dashboard_requires_authentication(client: TestClient) -> None:
    response = client.get('/api/dashboard')
    assert response.status_code == 401
    invalid_token = client.get('/api/dashboard', headers={'Authorization': 'Bearer not-a-jwt'})
    assert invalid_token.status_code == 401


def test_registration_rejects_passwords_over_bcrypt_byte_limit(client: TestClient) -> None:
    response = client.post(
        '/api/auth/register',
        json={
            'full_name': 'Unicode Password',
            'email': f'unicode-{uuid.uuid4().hex}@example.com',
            'password': '密码' * 20,
        },
    )
    assert response.status_code == 422


def test_apply_to_job_and_reject_duplicate(client: TestClient) -> None:
    register_response = client.post(
        '/api/auth/register',
        json={
            'full_name': 'Application Test',
            'email': f'application-{uuid.uuid4().hex}@example.com',
            'password': 'TestPassword123!',
        },
    )
    assert register_response.status_code == 200
    headers = {'Authorization': f"Bearer {register_response.json()['access_token']}"}

    first_response = client.post('/api/applications', json={'job_id': 1}, headers=headers)
    assert first_response.status_code == 201
    assert first_response.json()['role'] == 'AI Engineer'
    duplicate_response = client.post('/api/applications', json={'job_id': 1}, headers=headers)
    assert duplicate_response.status_code == 409
    missing_job_response = client.post('/api/applications', json={'job_id': 999999}, headers=headers)
    assert missing_job_response.status_code == 404


def test_resume_analysis_is_authenticated_and_persisted(client: TestClient) -> None:
    unauthorized = client.post('/api/resume/analyze', json={'resume_text': 'Python and SQL'})
    assert unauthorized.status_code == 401

    login_response = client.post(
        '/api/auth/login',
        json={'email': 'student@aicareercoach.com', 'password': 'Password123!'},
    )
    headers = {'Authorization': f"Bearer {login_response.json()['access_token']}"}
    response = client.post('/api/resume/analyze', json={'resume_text': 'Python and SQL'}, headers=headers)

    assert response.status_code == 200
    assert response.json()['extracted_skills'] == ['Python', 'SQL']
    dashboard = client.get('/api/dashboard', headers=headers).json()
    assert dashboard['resume_skills'] == ['Python', 'SQL']
    activity = client.get('/api/activity', headers=headers).json()
    assert any(entry['activity_type'] == 'resume_review' for entry in activity)


def test_interview_questions_are_scoped_to_authenticated_user(client: TestClient) -> None:
    responses = []
    for name in ('Interview One', 'Interview Two'):
        registration = client.post(
            '/api/auth/register',
            json={
                'full_name': name,
                'email': f'interview-{uuid.uuid4().hex}@example.com',
                'password': 'TestPassword123!',
            },
        )
        assert registration.status_code == 200
        token = registration.json()['access_token']
        responses.append(
            client.get('/api/interview', headers={'Authorization': f'Bearer {token}'}).json()
        )

    assert responses[0]
    assert responses[1]
    assert {question['id'] for question in responses[0]}.isdisjoint(
        question['id'] for question in responses[1]
    )
