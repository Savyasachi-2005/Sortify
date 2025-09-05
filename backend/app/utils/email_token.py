from datetime import datetime,timezone,timedelta
from jose import JWTError,jwt
from ..core.config import settings


def email_access_token(data: dict):
    to_encode = data.copy()
    expire=datetime.now(timezone.utc)+timedelta(minutes=30)
    to_encode.update(
        {"exp":expire}
    )
    encoded_jwt = jwt.encode(to_encode,settings.secret_key,algorithm=settings.algorithm)
    return encoded_jwt

def verify_email_token(token:str):
    try:
        payload = jwt.decode(token,settings.secret_key,algorithms=[settings.algorithm])
        username:str=payload.get("sub")
        if username is None:
            raise None
        return username
    except JWTError:
        raise None