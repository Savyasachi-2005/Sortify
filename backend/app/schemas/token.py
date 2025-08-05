from pydantic import BaseModel

class token(BaseModel):
    access_token:str
    refresh_token:str
    token_type:str = "bearer"
    
class TokenPayload(BaseModel):
    sub:str
    exp:str
    