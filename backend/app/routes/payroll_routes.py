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


@router.get("/{employee_id}")
def get_payroll(employee_id: int, db: Session = Depends(get_db)):
    return db.query(Payroll).filter(Payroll.employee_id == employee_id).all()


@router.post("/")
def create_payroll(data: dict, db: Session = Depends(get_db)):
    payroll = Payroll(**data)
    db.add(payroll)
    db.commit()
    return {"message": "Payroll added"}