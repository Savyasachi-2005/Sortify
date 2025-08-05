from typing import Optional
from pydantic import BaseModel,EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username:str
    
class UserCreate(UserBase):
    password:str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    

class UserOut(UserBase):
    id:int
    is_active:bool
    full_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class token(BaseModel):
    access_token: str
    token_type: str
