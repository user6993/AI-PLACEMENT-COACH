from pathlib import Path
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DB_PATH = Path(__file__).resolve().parents[2] / "database" / "app.db"
DB_PATH.parent.mkdir(parents=True, exist_ok=True)
ENGINE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH.as_posix()}")
if ENGINE_URL.startswith("postgres://"):
    ENGINE_URL = ENGINE_URL.replace("postgres://", "postgresql+psycopg://", 1)
elif ENGINE_URL.startswith("postgresql://"):
    ENGINE_URL = ENGINE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

engine_options = {"future": True, "pool_pre_ping": True}
if ENGINE_URL.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(ENGINE_URL, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from app.models import (  # noqa: F401
        InterviewAnswer,
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

    Base.metadata.create_all(bind=engine)
