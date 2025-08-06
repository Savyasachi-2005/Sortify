from fastapi import APIRouter,HTTPException,status,Depends
from repo.user import userRepo
from sqlalchemy.orm import Session
from utils.security import create_access_token,refresh_access_token,get_current_user
from core.db import get_db
from schemas.token import token
import schemas.token
from fastapi.security import OAuth2PasswordRequestForm
from core.config import settings
from jose import JWTError,jwt
apirouter = APIRouter(
    prefix="/api/auth",
    tags=["users"],
)

@apirouter.post("/login",response_model=token)
def login(form_data: OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    user= userRepo.auth_user(db,form_data.username,form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate":"Bearer"}
        )
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = refresh_access_token(data={"sub": user.email})
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.username,  # You might want to add full_name to your User model
            "is_active": user.is_active
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@apirouter.post("/refresh", response_model=token)
def refresh_token(token_data: schemas.token.RefreshRequest):
    cred_exp = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate":"Bearer"}
        )
    
    # Extract token from request body
    token = token_data.token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token is required"
        )
    
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise cred_exp
    except JWTError:
        raise cred_exp
    
    access_token = create_access_token(data={"sub": email})
    refresh_token = refresh_access_token(data={"sub": email})
    
    # Get user from database
    db = next(get_db())
    user = userRepo.get_by_email(db, email)
    if not user:
        raise cred_exp
    
    # Return full response with user data
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.username,
            "is_active": user.is_active
        },
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@apirouter.get("/me")
def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current authenticated user information"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name or current_user.username,
        "is_active": current_user.is_active
    }
