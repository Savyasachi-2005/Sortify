from pydantic import BaseModel
from typing import Optional

class UserInfo(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_active: bool

class token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserInfo
    
class TokenPayload(BaseModel):
    sub: str
    exp: str

class RefreshRequest(BaseModel):
    token: str
    