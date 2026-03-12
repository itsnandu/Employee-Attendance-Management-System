from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.employee_model import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()


@router.post("/")
def create_employee(data: dict, db: Session = Depends(get_db)):
    emp = Employee(**data)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


@router.put("/{id}")
def update_employee(id: int, data: dict, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()

    for key, value in data.items():
        setattr(emp, key, value)

    db.commit()
    return {"message": "Employee updated"}


@router.delete("/{id}")
def delete_employee(id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted"}