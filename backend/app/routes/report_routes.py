from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.attendance_model import Attendance
from app.models.leave_model import Leave
from app.models.payroll_model import Payroll

router = APIRouter(prefix="/reports", tags=["Reports"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/attendance")
def attendance_report(db: Session = Depends(get_db)):
    return db.query(Attendance).all()


@router.get("/leaves")
def leave_report(db: Session = Depends(get_db)):
    return db.query(Leave).all()


@router.get("/payroll")
def payroll_report(db: Session = Depends(get_db)):
    return db.query(Payroll).all()