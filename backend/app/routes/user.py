from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models.user import User
from ..utils.security import get_current_user
from ..core.db import get_db
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/users",
    tags=["users"]
)

class ApiKeyUpdate(BaseModel):
    api_key: str

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name or current_user.username,
        "is_active": current_user.is_active,
        "api_key": current_user.api_key  # Include API key in response
    }

@router.put("/api-key")
def update_api_key(
    api_key_data: ApiKeyUpdate, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user's API key"""
    try:
        # Validate API key format (basic check)
        if not api_key_data.api_key or not api_key_data.api_key.strip():
            raise HTTPException(status_code=400, detail="API key cannot be empty")
        
        if not api_key_data.api_key.startswith("sk-"):
            raise HTTPException(status_code=400, detail="Invalid API key format")
        
        # Update the user's API key
        current_user.api_key = api_key_data.api_key.strip()
        db.commit()
        
        return {"message": "API key updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update API key: {str(e)}")
