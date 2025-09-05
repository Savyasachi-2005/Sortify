import os
from core.db import Base, engine
from models.user import User
from fastapi import FastAPI
from routes import register, user, email_verify, ai, email, tasks
from fastapi.middleware.cors import CORSMiddleware

# Clear existing tables and recreate
# print("Dropping and recreating database tables...")
# Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")

app = FastAPI(title="SortIQ API", version="1.0.0")

# Dynamic CORS based on env var ALLOW_ORIGINS (comma-separated). If '*', disable credentials.
origins_env = os.getenv("ALLOW_ORIGINS")
if origins_env:
    origins = [o.strip() for o in origins_env.split(",") if o.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

allow_credentials = not (len(origins) == 1 and origins[0] == "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(ai.router)
app.include_router(register.router)
app.include_router(user.router)
app.include_router(email_verify.apirouter)
app.include_router(email.router)
app.include_router(tasks.router)

@app.get("/")
def root():
    return {"message": "SortIQ API is running", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}