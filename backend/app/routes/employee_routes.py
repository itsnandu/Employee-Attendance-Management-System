from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.employee_model import Employee
from app.utils.auth_deps import get_current_user

router = APIRouter(prefix="/employees", tags=["Employees"])


def _emp_to_dict(emp):
    """Convert Employee to frontend format."""
    parts = [emp.first_name or "", emp.last_name or ""]
    name = " ".join(p for p in parts if p).strip() or "Unknown"
    return {
        "id": emp.id,
        "name": name,
        "email": emp.email or "",
        "role": emp.position or "",
        "department": emp.department or "",
        "phone": emp.phone_number or "",
        "salary": emp.salary,
        "status": emp.status or "active",
        "joined": str(emp.joining_date) if emp.joining_date else "",
    }


def _data_to_emp(data):
    """Convert frontend format to Employee fields."""
    name = (data.get("name") or "").strip()
    parts = name.split(" ", 1)
    first_name = parts[0] if parts else ""
    last_name = parts[1] if len(parts) > 1 else ""
    return {
        "first_name": first_name,
        "last_name": last_name,
        "email": data.get("email"),
        "department": data.get("department"),
        "position": data.get("role") or data.get("position"),
        "phone_number": data.get("phone"),
        "joining_date": data.get("joined") or data.get("joining_date"),
        "salary": data.get("salary"),
        "status": data.get("status") or "active",
    }


@router.get("/me")
def get_current_employee(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return current user's employee record (JWT required). Returns null if no employee linked."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    emp = db.query(Employee).filter(Employee.email == user.email).first()
    if not emp:
        return None  # 200 with null - frontend falls back to getAll() + match
    return _emp_to_dict(emp)


@router.get("/")
def get_employees(db: Session = Depends(get_db)):
    emps = db.query(Employee).all()
    return [_emp_to_dict(e) for e in emps]


@router.post("/")
def create_employee(data: dict, db: Session = Depends(get_db)):
    emp_data = _data_to_emp(data)
    emp = Employee(**emp_data)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return _emp_to_dict(emp)


@router.put("/{id}")
def update_employee(id: int, data: dict, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        return {"error": "Employee not found"}
    emp_data = _data_to_emp(data)
    for key, value in emp_data.items():
        setattr(emp, key, value)
    db.commit()
    db.refresh(emp)
    return _emp_to_dict(emp)


@router.delete("/{id}")
def delete_employee(id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        return {"error": "Employee not found"}
    db.delete(emp)
    db.commit()
    return {"message": "Employee deleted"}