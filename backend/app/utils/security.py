from datetime import datetime,timezone,timedelta
from jose import jwt,JWTError
from core.config import settings
from typing import Optional 
from fastapi import HTTPException,Depends,status
from fastapi.security import OAuth2PasswordBearer
from core.db import get_db
from models.user import User
from sqlalchemy.orm import Session

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
def create_access_token(data: dict, expires_delta:timedelta=None):
    to_encode = data.copy()
    expire=datetime.now(timezone.utc)+(expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update(
        {"exp":expire}
    )
    encoded_jwt = jwt.encode(to_encode,settings.secret_key,algorithm=settings.algorithm)
    return encoded_jwt

def refresh_access_token(data: dict):
    to_encode = data.copy()
    expire=datetime.now(timezone.utc)+timedelta(days=7)
    to_encode.update(
        {"exp":expire}
    )
    encoded_jwt = jwt.encode(to_encode,settings.secret_key,algorithm=settings.algorithm)
    return encoded_jwt

def verify_token(token:str,cred_exp):
    try:
        payload = jwt.decode(token,settings.secret_key,algorithms=[settings.algorithm])
        username:str=payload.get("sub")
        if username is None:
            raise cred_exp
        return username
    except JWTError:
        raise cred_exp
    
def get_current_user(token:str=Depends(oauth2_scheme),db:Session=Depends(get_db)):
    cred_exp = HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate":"Bearer"}
            )
    username=verify_token(token,cred_exp)
    user=db.query(User).filter(User.email==username).first()
    if user is None:
        raise cred_exp
    return user