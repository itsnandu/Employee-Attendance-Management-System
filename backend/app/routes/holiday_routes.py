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
    holidays = db.query(Holiday).all()
    return [{
        "id": h.id,
        "title": h.title,
        "name": h.title,
        "date": str(h.holiday_date) if h.holiday_date else None,
        "holiday_date": str(h.holiday_date) if h.holiday_date else None,
        "type": getattr(h, "type", None) or "public",
    } for h in holidays]


@router.post("/")
def create_holiday(data: dict, db: Session = Depends(get_db)):
    holiday = Holiday(
        title=data.get("name") or data.get("title"),
        holiday_date=data.get("date") or data.get("holiday_date"),
        type=data.get("type", "public"),
    )
    db.add(holiday)
    db.commit()
    db.refresh(holiday)
    return {"id": holiday.id, "message": "Holiday added"}


@router.put("/{id}")
def update_holiday(id: int, data: dict, db: Session = Depends(get_db)):
    holiday = db.query(Holiday).filter(Holiday.id == id).first()
    if not holiday:
        return {"error": "Holiday not found"}
    if "name" in data or "title" in data:
        holiday.title = data.get("name") or data.get("title")
    if "date" in data or "holiday_date" in data:
        holiday.holiday_date = data.get("date") or data.get("holiday_date")
    if "type" in data:
        holiday.type = data["type"]
    db.commit()
    return {"message": "Holiday updated"}


@router.delete("/{id}")
def delete_holiday(id: int, db: Session = Depends(get_db)):
    holiday = db.query(Holiday).filter(Holiday.id == id).first()
    if not holiday:
        return {"error": "Holiday not found"}
    db.delete(holiday)
    db.commit()
    return {"message": "Holiday deleted"}