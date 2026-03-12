from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user_model import User
from app.utils.password_hash import verify_password
from app.utils.jwt_handler import create_token

router = APIRouter()

def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data["email"]).first()

    if not user:
        return {"error": "User not found"}

    if not verify_password(data["password"], user.password):
        return {"error": "Invalid password"}

    token = create_token({"user_id": user.id})

    return {
        "token": token,
        "role": user.role
    }