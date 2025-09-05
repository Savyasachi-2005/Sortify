from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..core.db import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_task = Column(String, nullable=False)
    smart_task = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    status = Column(String, nullable=False, default='active')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    