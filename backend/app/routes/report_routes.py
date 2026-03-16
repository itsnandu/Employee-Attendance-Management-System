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
    records = db.query(Attendance).all()
    return [{"id": a.id, "employee_id": a.employee_id, "date": str(a.date), "check_in": str(a.check_in_time) if a.check_in_time else None, "check_out": str(a.check_out_time) if a.check_out_time else None, "status": a.status} for a in records]


@router.get("/leaves")
def leave_report(db: Session = Depends(get_db)):
    leaves = db.query(Leave).all()
    return [{"id": l.id, "employee_id": l.employee_id, "leave_type": l.leave_type, "start_date": str(l.start_date), "end_date": str(l.end_date), "reason": l.reason, "status": l.status} for l in leaves]


@router.get("/payroll")
def payroll_report(db: Session = Depends(get_db)):
    records = db.query(Payroll).all()
    return [{"id": p.id, "employee_id": p.employee_id, "month": p.month, "salary": p.salary, "bonus": p.bonus or 0, "deduction": p.deduction or 0} for p in records]