from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from schemas.task import ProcessedTask, TaskDetail
from repo.task import create_task, get_tasks, delete_task, update_task_status
from core.db import get_db
from models.user import User
from utils.security import get_current_user

router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"]
)

@router.get("/", response_model=List[TaskDetail])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_tasks(db, current_user.id)

@router.post("/save", status_code=status.HTTP_201_CREATED, response_model=TaskDetail)
def save_task(
    task: ProcessedTask,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_task(db, task, current_user.id)

@router.delete("/{task_id}")
def remove_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if delete_task(db, task_id, current_user.id):
        return {"message": "Task deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")

@router.patch("/{task_id}/status")
def update_status(
    task_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = update_task_status(db, task_id, current_user.id, status)
    if task:
        return {"message": "Task status updated successfully"}
    raise HTTPException(status_code=404, detail="Task not found")
