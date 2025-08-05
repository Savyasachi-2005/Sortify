from core.db import Base, engine
from models.user import User
from fastapi import FastAPI
from routes import register, user, email_verify
from fastapi.middleware.cors import CORSMiddleware

# Clear existing tables and recreate
print("Dropping and recreating database tables...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")

app = FastAPI(title="SortIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register.router)
app.include_router(user.router)
app.include_router(email_verify.apirouter)

@app.get("/")
def root():
    return {"message": "SortIQ API is running", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}