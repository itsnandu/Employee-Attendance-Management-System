from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.attendance_model import Attendance

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/checkin")
def checkin(data: dict, db: Session = Depends(get_db)):
    record = Attendance(
        employee_id=data["employee_id"],
        date=data["date"],
        check_in=data["check_in"],
        status="Present"
    )

    db.add(record)
    db.commit()

    return {"message": "Checked in"}


@router.post("/checkout")
def checkout(data: dict, db: Session = Depends(get_db)):
    record = db.query(Attendance).filter(
        Attendance.employee_id == data["employee_id"]
    ).first()

    record.check_out = data["check_out"]

    db.commit()

    return {"message": "Checked out"}


@router.get("/")
def get_attendance(db: Session = Depends(get_db)):
    return db.query(Attendance).all()