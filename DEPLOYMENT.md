# Deployment

## Backend (Render)

- Ensure you have a Postgres database provisioned.
- Set environment variables in Render:
  - DATABASE_URL
  - SECRET_KEY
  - ALGORITHM
  - ACCESS_TOKEN_EXPIRE_MINUTES
  - MAIL_USERNAME, MAIL_PASSWORD, MAIL_FROM, MAIL_PORT, MAIL_SERVER
  - AI_API_KEY
  - ALLOW_ORIGINS (comma-separated, e.g. `https://sortiq.vercel.app`)
- Use `render.yaml` or set:
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Frontend (Vercel)

- Import the project in Vercel.
- Set Environment Variable:
  - `VITE_API_BASE_URL` to your backend URL (e.g. `https://sortiq-backend.onrender.com`)
- Build Command: `npm run build`
- Output Directory: `dist`
- `vercel.json` includes SPA rewrites.

## Local Development

- Backend: `uvicorn app.main:app --reload`
- Frontend: `npm run dev`

```env
# example .env for backend
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/db
SECRET_KEY=...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM=...
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
AI_API_KEY=sk-...
ALLOW_ORIGINS=http://localhost:5173
```
