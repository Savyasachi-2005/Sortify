from pydantic import BaseModel, UUID4
from typing import List,Optional

class TaskInput(BaseModel):
    tasks:List[str]
    user_id:Optional[int] = None
    
class ProcessedTask(BaseModel):
    task: str
    smart_task: str
    priority: str
    
class TaskOutput(BaseModel):
    processed_task : List[ProcessedTask]


class TaskInput(BaseModel):
    tasks:List[str]
    user_id:Optional[int] = None
    
class ProcessedTask(BaseModel):
    task: str
    smart_task: str
    priority: str
    
class TaskOutput(BaseModel):
    processed_task : List[ProcessedTask]