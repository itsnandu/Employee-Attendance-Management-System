from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.announcement_model import Announcement

router = APIRouter(prefix="/announcements", tags=["Announcements"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).all()


@router.post("/")
def create_announcement(data: dict, db: Session = Depends(get_db)):
    ann = Announcement(**data)
    db.add(ann)
    db.commit()
    return {"message": "Announcement created"}