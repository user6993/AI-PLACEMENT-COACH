from __future__ import annotations

import json
import os
import ast
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from app.database import SessionLocal, init_db
from app.models import (
    InterviewQuestion,
    InterviewSession,
    Job,
    JobApplication,
    LearningRoadmap,
    LearningRoadmapItem,
    Resume,
    SkillAssessment,
    User,
    UserActivity,
)
from app.schemas import (
    ActivityEntry,
    ApplicationRecord,
    InterviewQuestionSchema,
    JobApplicationCreate,
    JobSchema,
    LoginRequest,
    RegisterRequest,
    ResumeAnalyzeRequest,
    ResumeAnalysis,
    RoadmapItemSchema,
    SkillGapItem,
    TokenResponse,
    UserPublic,
)
from app.security import create_access_token, decode_access_token, hash_password, verify_password

security_scheme = HTTPBearer(auto_error=False)
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]


@asynccontextmanager
async def lifespan(_: FastAPI):
    db = SessionLocal()
    try:
        if os.getenv("APP_ENV", "development").lower() != "production":
            seed_demo_data(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="AI Placement Coach API",
    description="Career preparation platform backend for students and recruiters",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


init_db()


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    try:
        payload = decode_access_token(credentials.credentials)
    except InvalidTokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc

    user_id = payload.get("sub")
    if not isinstance(user_id, str) or not user_id.isdecimal():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject")

    user = db.get(User, int(user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def seed_demo_data(db: Session) -> None:
    if db.query(User).count() > 0:
        return

    student = User(
        full_name="Priya Sharma",
        email="student@aicareercoach.com",
        password_hash=hash_password("Password123!"),
        role="student",
    )
    db.add(student)
    db.flush()

    resume = Resume(
        user_id=student.id,
        file_name="priya_resume.pdf",
        summary="AI/ML graduate with internship experience in Python, ML, SQL, and cloud data workflows.",
        extracted_skills="[\"Python\", \"Machine Learning\", \"SQL\", \"Pandas\", \"FastAPI\", \"Data Visualization\"]",
        overall_score=88.4,
    )
    db.add(resume)

    skill_rows = [
        SkillAssessment(user_id=student.id, skill_name="Python", score=87.0, target_score=90.0),
        SkillAssessment(user_id=student.id, skill_name="Machine Learning", score=79.0, target_score=88.0),
        SkillAssessment(user_id=student.id, skill_name="SQL", score=90.0, target_score=90.0),
        SkillAssessment(user_id=student.id, skill_name="System Design", score=68.0, target_score=85.0),
    ]
    db.add_all(skill_rows)

    job1 = Job(
        title="AI Engineer",
        company="Nimbus Labs",
        location="Bengaluru",
        type="Full-time",
        salary="₹18-24 LPA",
        description="Build ML-powered workflows and experiment tracking pipelines for product analytics.",
        required_skills="[\"Python\", \"Machine Learning\", \"SQL\", \"MLOps\"]",
    )
    job2 = Job(
        title="Data Analyst",
        company="BluePeak",
        location="Remote",
        type="Hybrid",
        salary="₹12-18 LPA",
        description="Turn product data into reliable insights with SQL, Python, and dashboarding.",
        required_skills="[\"SQL\", \"Python\", \"Data Visualization\"]",
    )
    db.add_all([job1, job2])
    db.flush()

    db.add_all(
        [
            JobApplication(user_id=student.id, job_id=job1.id, status="interviewing"),
            JobApplication(user_id=student.id, job_id=job2.id, status="applied"),
        ]
    )

    roadmap = LearningRoadmap(user_id=student.id, title="AI/ML Engineer Roadmap", progress=62)
    db.add(roadmap)
    db.flush()

    db.add_all(
        [
            LearningRoadmapItem(roadmap_id=roadmap.id, title="Build end-to-end ML projects", status="done", due_week="Week 1", notes="Completed churn prediction and recommender demo apps."),
            LearningRoadmapItem(roadmap_id=roadmap.id, title="Deepen SQL + analytics", status="in_progress", due_week="Week 2", notes="Focus on window functions and dashboards."),
            LearningRoadmapItem(roadmap_id=roadmap.id, title="Practice system design", status="pending", due_week="Week 3", notes="Study microservice and event-driven design patterns."),
        ]
    )

    session = InterviewSession(user_id=student.id, topic="Data Structures and ML Design", score=78.5, status="completed")
    db.add(session)
    db.flush()
    db.add_all(
        [
            InterviewQuestion(session_id=session.id, prompt="Explain how you would design a recommendation model for a high-scale user platform.", difficulty="hard"),
            InterviewQuestion(session_id=session.id, prompt="Describe a time when you optimized a data pipeline for speed and accuracy.", difficulty="medium"),
        ]
    )

    db.add(UserActivity(user_id=student.id, activity_type="resume_review", details="Resume optimized for AI and Python roles."))
    db.add(UserActivity(user_id=student.id, activity_type="job_application", details="Submitted application to BluePeak Data Analyst role."))
    db.commit()


def create_interview_session(db: Session, user_id: int) -> None:
    session = InterviewSession(user_id=user_id, topic="General Placement Interview", status="in_progress")
    db.add(session)
    db.flush()
    db.add_all(
        [
            InterviewQuestion(
                session_id=session.id,
                prompt="Tell me about a technical project you are proud of and the impact it had.",
                difficulty="medium",
            ),
            InterviewQuestion(
                session_id=session.id,
                prompt="How would you investigate a machine-learning model whose production accuracy has dropped?",
                difficulty="hard",
            ),
        ]
    )


def parse_skill_list(value: str | None) -> list[str]:
    if not value:
        return []
    try:
        skills = json.loads(value)
    except json.JSONDecodeError:
        skills = ast.literal_eval(value)
    if not isinstance(skills, list) or any(not isinstance(skill, str) for skill in skills):
        raise ValueError("Stored skill data must be a list of strings")
    return skills


def serialize_job(job: Job) -> JobSchema:
    return JobSchema(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        type=job.type,
        salary=job.salary,
        description=job.description,
        required_skills=parse_skill_list(job.required_skills),
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy", "message": "Backend is running successfully!"}


@app.get("/api/health")
def api_health() -> dict[str, str]:
    return {"status": "healthy", "message": "AI Placement Coach API running"}


@app.post("/api/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email is already registered")

    user = User(full_name=payload.full_name.strip(), email=payload.email.lower(), password_hash=hash_password(payload.password), role="student")
    db.add(user)
    db.flush()
    create_interview_session(db, user.id)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserPublic(id=user.id, full_name=user.full_name, email=user.email, role=user.role))


@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserPublic(id=user.id, full_name=user.full_name, email=user.email, role=user.role))


@app.get("/api/auth/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user)) -> UserPublic:
    return UserPublic(id=current_user.id, full_name=current_user.full_name, email=current_user.email, role=current_user.role)


@app.get("/api/dashboard")
def dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, Any]:
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
    jobs = db.query(Job).all()
    job_count = len(jobs)
    app_count = db.query(JobApplication).filter(JobApplication.user_id == current_user.id).count()
    skill_scores = db.query(SkillAssessment).filter(SkillAssessment.user_id == current_user.id).all()
    resume_skills = parse_skill_list(resume.extracted_skills) if resume else []
    resume_skill_set = {skill.casefold() for skill in resume_skills}
    match_scores = []
    for job in jobs:
        required_skills = parse_skill_list(job.required_skills)
        if required_skills:
            matched = resume_skill_set.intersection(skill.casefold() for skill in required_skills)
            match_scores.append(len(matched) / len(required_skills))
    best_match = max(match_scores, default=0.0)
    latest_interview = (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id, InterviewSession.status == "completed")
        .order_by(InterviewSession.created_at.desc())
        .first()
    )

    return {
        "user": {"full_name": current_user.full_name, "role": current_user.role},
        "metrics": [
            {"label": "Resume Keyword Coverage", "value": f"{resume.overall_score:.1f}%" if resume else "Not analyzed", "delta": "Latest analysis", "trend": "up"},
            {"label": "Applications", "value": str(app_count), "delta": "In your tracker", "trend": "up"},
            {"label": "Jobs Match", "value": f"{best_match:.0%}" if resume else "No resume", "delta": "Best skills overlap", "trend": "up"},
            {
                "label": "Interview Readiness",
                "value": f"{latest_interview.score:.1f}%" if latest_interview else "Not started",
                "delta": "Latest practice score",
                "trend": "up",
            },
        ],
        "skills": [
            {"skill": item.skill_name, "score": float(item.score), "target": float(item.target_score)}
            for item in skill_scores
        ],
        "resume_skills": resume_skills,
        "job_count": job_count,
        "resume_summary": resume.summary if resume else "No resume uploaded yet.",
    }


@app.post("/api/resume/analyze", response_model=ResumeAnalysis)
def analyze_resume(payload: ResumeAnalyzeRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> ResumeAnalysis:
    resume_text = payload.resume_text.strip()
    if not resume_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Resume text is required")

    skill_keywords = {
        "python": "Python",
        "sql": "SQL",
        "machine learning": "Machine Learning",
        "pandas": "Pandas",
        "fastapi": "FastAPI",
        "statistics": "Statistics",
        "data analysis": "Data Analysis",
        "nlp": "NLP",
        "docker": "Docker",
    }
    lowered_text = resume_text.casefold()
    found = sorted(
        {display_name for keyword, display_name in skill_keywords.items() if keyword in lowered_text}
    )
    score = round(len(found) / len(skill_keywords) * 100, 1)

    analysis = Resume(
        user_id=current_user.id,
        file_name="uploaded_resume.txt",
        summary=(
            f"Detected {len(found)} of {len(skill_keywords)} supported skill keywords. "
            "This is an initial keyword screen, not an assessment of resume quality."
        ),
        extracted_skills=json.dumps(found),
        overall_score=round(score, 1),
    )
    db.add(analysis)
    db.add(
        UserActivity(
            user_id=current_user.id,
            activity_type="resume_review",
            details=f"Completed a keyword screen with {len(found)} supported skill keywords.",
        )
    )
    db.commit()
    db.refresh(analysis)

    return ResumeAnalysis(file_name=analysis.file_name, summary=analysis.summary, extracted_skills=found, overall_score=analysis.overall_score)


@app.get("/api/jobs", response_model=list[JobSchema])
def list_jobs(db: Session = Depends(get_db)) -> list[JobSchema]:
    return [serialize_job(job) for job in db.query(Job).all()]


@app.get("/api/jobs/{job_id}", response_model=JobSchema)
def get_job(job_id: int, db: Session = Depends(get_db)) -> JobSchema:
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return serialize_job(job)


@app.get("/api/skill-gap")
def skill_gap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[SkillGapItem]:
    rows = db.query(SkillAssessment).filter(SkillAssessment.user_id == current_user.id).all()
    items = []
    for row in rows:
        gap = max(0.0, float(row.target_score - row.score))
        items.append(SkillGapItem(skill=row.skill_name, current=float(row.score), target=float(row.target_score), gap=gap))
    return items


@app.get("/api/interview", response_model=list[InterviewQuestionSchema])
def interview_questions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[InterviewQuestionSchema]:
    rows = (
        db.query(InterviewQuestion)
        .join(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id)
        .all()
    )
    return [InterviewQuestionSchema(id=row.id, prompt=row.prompt, difficulty=row.difficulty) for row in rows]


@app.get("/api/roadmap")
def roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, Any]:
    item_rows = (
        db.query(LearningRoadmapItem)
        .join(LearningRoadmap)
        .filter(LearningRoadmap.user_id == current_user.id)
        .all()
    )
    return {"items": [RoadmapItemSchema(id=item.id, title=item.title, status=item.status, due_week=item.due_week, notes=item.notes) for item in item_rows]}


@app.get("/api/applications", response_model=list[ApplicationRecord])
def applications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ApplicationRecord]:
    items = db.query(JobApplication, Job).join(Job, JobApplication.job_id == Job.id).filter(JobApplication.user_id == current_user.id).all()
    return [
        ApplicationRecord(
            id=applied.id,
            company=job.company,
            role=job.title,
            status=applied.status,
            applied_on=applied.applied_on,
        )
        for applied, job in items
    ]


@app.post("/api/applications", response_model=ApplicationRecord, status_code=status.HTTP_201_CREATED)
def create_application(
    payload: JobApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ApplicationRecord:
    job = db.get(Job, payload.job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    existing = (
        db.query(JobApplication)
        .filter(JobApplication.user_id == current_user.id, JobApplication.job_id == job.id)
        .first()
    )
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You have already applied to this job")

    application = JobApplication(user_id=current_user.id, job_id=job.id, status="applied")
    db.add(application)
    db.add(
        UserActivity(
            user_id=current_user.id,
            activity_type="job_application",
            details=f"Applied to {job.company} {job.title} role.",
        )
    )
    db.commit()
    db.refresh(application)

    return ApplicationRecord(
        id=application.id,
        company=job.company,
        role=job.title,
        status=application.status,
        applied_on=application.applied_on,
    )


@app.get("/api/activity", response_model=list[ActivityEntry])
def activity(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[ActivityEntry]:
    entries = db.query(UserActivity).filter(UserActivity.user_id == current_user.id).order_by(UserActivity.created_at.desc()).all()
    return [ActivityEntry(id=item.id, activity_type=item.activity_type, details=item.details, created_at=item.created_at) for item in entries]


@app.get("/")
def index() -> dict[str, str]:
    return {"message": "AI Placement Coach API ready"}
