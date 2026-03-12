from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.holiday_model import Holiday

router = APIRouter(prefix="/holidays", tags=["Holidays"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_holidays(db: Session = Depends(get_db)):
    return db.query(Holiday).all()


@router.post("/")
def create_holiday(data: dict, db: Session = Depends(get_db)):
    holiday = Holiday(**data)
    db.add(holiday)
    db.commit()
    return {"message": "Holiday added"}


@router.delete("/{id}")
def delete_holiday(id: int, db: Session = Depends(get_db)):
    holiday = db.query(Holiday).filter(Holiday.id == id).first()
    db.delete(holiday)
    db.commit()
    return {"message": "Holiday deleted"}