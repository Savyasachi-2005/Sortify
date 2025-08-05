from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate
from utils.hashing import Hash

class userRepo:
    @staticmethod
    def create_user(db: Session,user: UserCreate):
        hashed_pwd=Hash.bcrypt(user.password)
        db_user= User(
            username=user.username,
            email=user.email,
            password=hashed_pwd,
            full_name=user.full_name,
            is_active=False
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
        


    @staticmethod
    def auth_user(db:Session,email:str,password:str):
        user=db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not Hash.verify(password,user.password):
            return None
        return user