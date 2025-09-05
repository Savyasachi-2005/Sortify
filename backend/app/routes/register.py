from fastapi import APIRouter, Depends, HTTPException, status
from ..repo.user import userRepo
from sqlalchemy.orm import Session
from ..core.db import get_db
from ..schemas.user import UserCreate, UserOut, UserLogin
from ..utils.email_utils import send_verification_link
from ..utils.email_token import email_access_token
from ..utils.security import create_access_token
from ..models.user import User
from pydantic import ValidationError
import traceback

router = APIRouter(
    prefix="/api/auth",
    tags=["users"],
)

@router.post("/signup")
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        print(f"Received user data: {user}")  # Debug log
        
        # Check if user already exists by email
        existing_user_email = db.query(User).filter(User.email == user.email).first()
        if existing_user_email:
            print(f"Email already exists: {user.email}")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if user already exists by username
        existing_user_username = db.query(User).filter(User.username == user.username).first()
        if existing_user_username:
            print(f"Username already exists: {user.username}")  # Debug log
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        print("Creating new user...")  # Debug log
        create_user = userRepo.create_user(db, user)
        print(f"User created successfully: {create_user.id}")  # Debug log
        
        # Generate tokens and send email
        token = email_access_token({"sub": create_user.email})
        verification_link = f"http://localhost:8000/api/auth/verify-email?token={token}"
        subject = "Verify your email"
        body = f"Hi {create_user.username},\n\nClick the link below to verify your email:\n{verification_link}\n\nThanks!"
        
        try:
            await send_verification_link(to=create_user.email, subject=subject, body=body)
            print("Verification email sent successfully")  # Debug log
        except Exception as email_error:
            print(f"Failed to send verification email: {email_error}")  # Debug log
            # Don't fail the registration if email fails
        
        access_token = create_access_token(data={"sub": create_user.email})
        
        return {
            "user": {
                "id": create_user.id,
                "username": create_user.username,
                "email": create_user.email,
                "full_name": create_user.full_name or create_user.username,
                "is_active": create_user.is_active
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
        
    except HTTPException as he:
        # Re-raise HTTP exceptions (like email already exists)
        print(f"HTTP Exception: {he.detail}")  # Debug log
        raise he
        
    except ValidationError as e:
        print(f"Validation error: {e}")  # Debug log
        error_messages = []
        for error in e.errors():
            field = " -> ".join(str(loc) for loc in error['loc'])
            message = error['msg']
            error_messages.append(f"{field}: {message}")
        
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="; ".join(error_messages)
        )
        
    except Exception as e:
        print(f"Unexpected error during registration: {e}")  # Debug log
        print(f"Traceback: {traceback.format_exc()}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )

@router.post("/login")
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        print(f"Received login data: {user_credentials}")  # Debug log
        
        # Check if the user exists
        user = db.query(User).filter(User.email == user_credentials.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Authenticate the user
        authenticated_user = userRepo.auth_user(
            db, 
            user_credentials.email, 
            user_credentials.password
        )
        
        if not authenticated_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name or user.username,
                "is_active": user.is_active
            },
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        print(f"Unexpected error during login: {e}")  # Debug log
        print(f"User tried to log in with email: {user_credentials.email}")  # Debug log
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during login: {str(e)}"
        )