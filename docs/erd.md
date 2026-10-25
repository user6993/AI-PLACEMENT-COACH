# Database Schema

This project uses a normalized relational model with SQLite for local development and a PostgreSQL-friendly schema for production.

```mermaid
erDiagram
    USERS ||--o{ RESUMES : owns
    USERS ||--o{ JOB_APPLICATIONS : applies
    USERS ||--o{ SKILL_ASSESSMENTS : tracks
    USERS ||--o{ LEARNING_ROADMAPS : plans
    USERS ||--o{ INTERVIEW_SESSIONS : conducts
    USERS ||--o{ USER_ACTIVITY : logs
    JOBS ||--o{ JOB_APPLICATIONS : receives
    LEARNING_ROADMAPS ||--o{ LEARNING_ROADMAP_ITEMS : contains
    INTERVIEW_SESSIONS ||--o{ INTERVIEW_QUESTIONS : contains
    INTERVIEW_QUESTIONS ||--o{ INTERVIEW_ANSWERS : records

    USERS {
      int id PK
      string email UK
      string password_hash
      string full_name
      string role
      datetime created_at
      datetime updated_at
    }

    RESUMES {
      int id PK
      int user_id FK
      string file_name
      text summary
      text extracted_skills
      float overall_score
      datetime created_at
      datetime updated_at
    }

    JOBS {
      int id PK
      string title
      string company
      string location
      string type
      string salary
      text description
      text required_skills
      datetime created_at
    }

    JOB_APPLICATIONS {
      int id PK
      int user_id FK
      int job_id FK
      string status
      datetime applied_on
    }

    SKILL_ASSESSMENTS {
      int id PK
      int user_id FK
      string skill_name
      float score
      float target_score
      datetime last_updated
    }

    INTERVIEW_SESSIONS {
      int id PK
      int user_id FK
      string topic
      float score
      string status
      datetime created_at
    }

    INTERVIEW_QUESTIONS {
      int id PK
      int session_id FK
      text prompt
      string difficulty
    }

    INTERVIEW_ANSWERS {
      int id PK
      int question_id FK
      text answer_text
      bool scored
    }

    LEARNING_ROADMAPS {
      int id PK
      int user_id FK
      string title
      int progress
      datetime created_at
    }

    LEARNING_ROADMAP_ITEMS {
      int id PK
      int roadmap_id FK
      string title
      string status
      string due_week
      text notes
    }

    USER_ACTIVITY {
      int id PK
      int user_id FK
      string activity_type
      text details
      datetime created_at
    }
```

## Notes
- File uploads are stored in `uploads/` rather than directly in the database.
- Ownership checks ensure a user only reads their own profiles and applications.
- The schema is intentionally PostgreSQL-compatible and easy to migrate with Alembic.
