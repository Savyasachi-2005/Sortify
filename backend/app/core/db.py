from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker,Session
from .config import settings

# Normalize Render-provided postgres URL (postgres:// -> postgresql+psycopg2://)
def _normalize_db_url(url: str) -> str:
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    return url

engine=create_engine(_normalize_db_url(settings.database_url))
SessionLocal=sessionmaker(autocommit=False, autoflush=False,bind=engine)
Base=declarative_base()

def get_db():
    db:Session=SessionLocal()
    try:
        yield db
    finally:
        db.close()
