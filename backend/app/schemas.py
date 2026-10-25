from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_bcrypt_password_size(cls, password: str) -> str:
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return password


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_bcrypt_password_size(cls, password: str) -> str:
        if len(password.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return password


class UserPublic(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ResumeAnalysis(BaseModel):
    file_name: str
    summary: str
    extracted_skills: list[str]
    overall_score: float


class ResumeAnalyzeRequest(BaseModel):
    resume_text: str = Field(..., min_length=1, max_length=200_000)


class JobSchema(BaseModel):
    id: int
    title: str
    company: str
    location: str
    type: str
    salary: str
    description: str
    required_skills: list[str]

    class Config:
        from_attributes = True


class DashboardMetric(BaseModel):
    label: str
    value: str
    delta: str
    trend: str


class SkillGapItem(BaseModel):
    skill: str
    current: float
    target: float
    gap: float


class RoadmapItemSchema(BaseModel):
    id: int
    title: str
    status: str
    due_week: str
    notes: str


class InterviewQuestionSchema(BaseModel):
    id: int
    prompt: str
    difficulty: str


class ApplicationRecord(BaseModel):
    id: int
    company: str
    role: str
    status: str
    applied_on: datetime


class JobApplicationCreate(BaseModel):
    job_id: int = Field(..., gt=0)


class ActivityEntry(BaseModel):
    id: int
    activity_type: str
    details: str
    created_at: datetime
