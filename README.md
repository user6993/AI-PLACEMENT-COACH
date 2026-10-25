# AI Placement Coach

AI Placement Coach is a full-stack career preparation app for students. It combines a React + TypeScript frontend with a FastAPI backend and a SQLite database for local development.

## Current functionality

- Student registration and login with JWT authentication
- Account-protected workspace and dashboard
- Resume text analysis with a transparent, keyword-coverage score
- Job listings, skill-overlap matching, applications, and application history
- Skill-gap, roadmap, and interview-question views
- Per-user application and activity records
- Responsive layouts with mobile navigation and scrollable application tables

The resume analyzer is currently a deterministic keyword screen; it does not call a hosted AI model. Interview answers and coding drafts are saved only in the local browser. Password recovery, resume file uploads, interview answer scoring, and editable education/career profile fields are not connected yet.

Project author: Deepak Yadav — B.Tech Computer Science Engineering (AI/ML specialization).

## Requirements

- Python 3.10+
- Node.js 20.19+ or 22.12+

## Run locally on Windows

Start the backend in one PowerShell terminal:

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Start the frontend in another terminal:

```powershell
Set-Location frontend
npm install
npm run dev -- --host 127.0.0.1
```

Vite proxies `/api` requests to `http://localhost:8000` during development. Set `VITE_API_BASE_URL` in `frontend/.env.local` only when the API is hosted at another address.

On an empty local database, the backend seeds a demo account:

- Email: `student@aicareercoach.com`
- Password: `Password123!`

Open `http://localhost:5173`. API health and interactive API docs are available at `http://localhost:8000/api/health` and `http://localhost:8000/docs`.

## Configuration

The backend reads configuration from process environment variables:

| Variable | Purpose | Local default |
| --- | --- | --- |
| `JWT_SECRET` | Signs access tokens | Development-only fallback; set a strong random value outside local development |
| `APP_ENV` | Runtime environment | `development` |
| `DATABASE_URL` | SQLAlchemy database URL | SQLite at `database/app.db` in the workspace |
| `ALLOWED_ORIGINS` | Comma-separated frontend origins for CORS | `http://localhost:5173,http://127.0.0.1:5173` |

Production startup fails if `APP_ENV=production` and the development JWT secret is still in use. Configure environment variables in the hosting platform's secret/configuration store. Do not publish `.env` files or local database contents.

## Validation

```powershell
Set-Location backend
python -m pytest tests -q

Set-Location ..\frontend
npm run lint
npm run build
```

## Production deployment

- `render.yaml` describes the FastAPI service. Set `DATABASE_URL` to a durable PostgreSQL connection string, `JWT_SECRET` to a unique random secret of at least 32 characters, and `ALLOWED_ORIGINS` to the exact deployed Vercel origin in Render's environment settings.
- `frontend/vercel.json` enables client-side route fallback. Set the Vercel project root to `frontend` and configure `VITE_API_BASE_URL` to the deployed Render API origin, without a trailing slash.
- `backend/migrations/` contains schema migrations. Never point production migrations at the local SQLite database.
- Do not put provider secrets in this repository or chat. Configure secrets only in the hosting platform.
