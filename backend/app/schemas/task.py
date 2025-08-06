from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TaskBase(BaseModel):
    original_task: str
    smart_task: str
    priority: str

class TaskInput(BaseModel):
    tasks: List[str]
    user_id: Optional[int] = None

class ProcessedTask(TaskBase):
    pass

class TaskOutput(BaseModel):
    processed_tasks: List[ProcessedTask]

class TaskDetail(TaskBase):
    id: int
    status: str
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True  # This enables ORM mode



    

    
