from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import Optional
import os
from pathlib import Path
class Settings(BaseSettings):
    database_url:str
    secret_key:Optional[str]=None
    algorithm:str
    access_token_expire_minutes:int
    mail_username : str
    mail_password : str
    mail_from : str
    mail_port : int
    mail_server : str
    

    class Config:
        env_file = Path(__file__).parent.parent.parent / ".env"
        extra = "ignore"  # Ignore extra fields from .env file
        
settings=Settings()

