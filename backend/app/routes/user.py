from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.user import User
from utils.security import get_current_user
from core.db import get_db

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name or current_user.username,
        "is_active": current_user.is_active
    }
