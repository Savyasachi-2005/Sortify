from sqlalchemy.orm import Session
from ..models.task import Task
from ..schemas.task import ProcessedTask

def create_task(db:Session,task_data:ProcessedTask,user_id:int):
    new_task = Task(
        user_id=user_id,
        original_task=task_data.original_task,
        smart_task=task_data.smart_task,
        priority=task_data.priority
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task 

def get_tasks(db:Session, user_id:int):
    return db.query(Task).filter(Task.user_id == user_id).all()

def delete_task(db:Session, task_id:int, user_id:int):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if task:
        db.delete(task)
        db.commit()
        return True
    return False

def update_task_status(db:Session, task_id:int, user_id:int, status:str):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if task:
        task.status = status
        db.commit()
        db.refresh(task)
        return task
    return None
