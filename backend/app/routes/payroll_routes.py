from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.payroll_model import Payroll


router = APIRouter(prefix="/payroll", tags=["Payroll"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_all_payroll(db: Session = Depends(get_db)):
    records = db.query(Payroll).all()
    return [{"id": p.id, "employee_id": p.employee_id, "month": p.month, "salary": p.salary, "bonus": p.bonus or 0, "deduction": p.deduction or 0} for p in records]


@router.get("/{employee_id}")
def get_payroll(employee_id: int, db: Session = Depends(get_db)):
    records = db.query(Payroll).filter(Payroll.employee_id == employee_id).all()
    return [{"id": p.id, "employee_id": p.employee_id, "month": p.month, "salary": p.salary, "bonus": p.bonus or 0, "deduction": p.deduction or 0} for p in records]


@router.post("/")
def create_payroll(data: dict, db: Session = Depends(get_db)):
    payroll = Payroll(**data)
    db.add(payroll)
    db.commit()
    return {"message": "Payroll added"}