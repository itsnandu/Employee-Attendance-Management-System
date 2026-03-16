from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.leave_model import Leave
from app.models.employee_model import Employee

router = APIRouter(prefix="/leave", tags=["Leave"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _emp_name(emp):
    if not emp:
        return "Unknown"
    return " ".join(filter(None, [emp.first_name, emp.last_name])).strip() or "Unknown"


@router.post("/apply")
def apply_leave(data: dict, db: Session = Depends(get_db)):
    leave = Leave(
        employee_id=data.get("employee_id"),
        leave_type=data.get("leave_type") or "Casual",
        start_date=data.get("start_date") or data.get("from"),
        end_date=data.get("end_date") or data.get("to"),
        reason=data.get("reason", ""),
        status="Pending",
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return {"message": "Leave applied", "id": leave.id}


@router.get("/")
def get_leaves(db: Session = Depends(get_db)):
    leaves = db.query(Leave).all()
    employees = {e.id: e for e in db.query(Employee).all()}
    result = []
    for lv in leaves:
        emp = employees.get(lv.employee_id)
        result.append({
            "id": lv.id,
            "employee_id": lv.employee_id,
            "name": _emp_name(emp),
            "leave_type": lv.leave_type,
            "start_date": str(lv.start_date) if lv.start_date else None,
            "end_date": str(lv.end_date) if lv.end_date else None,
            "from": str(lv.start_date) if lv.start_date else None,
            "to": str(lv.end_date) if lv.end_date else None,
            "reason": lv.reason,
            "status": (lv.status or "Pending").lower(),
            "days": (lv.end_date - lv.start_date).days + 1 if lv.start_date and lv.end_date else 1,
        })
    return result


@router.put("/approve/{id}")
def approve_leave(id: int, db: Session = Depends(get_db)):
    leave = db.query(Leave).filter(Leave.id == id).first()
    if not leave:
        return {"error": "Leave not found"}
    leave.status = "Approved"
    db.commit()
    return {"message": "Leave approved"}


@router.put("/reject/{id}")
def reject_leave(id: int, db: Session = Depends(get_db)):
    leave = db.query(Leave).filter(Leave.id == id).first()
    if not leave:
        return {"error": "Leave not found"}
    leave.status = "Rejected"
    db.commit()
    return {"message": "Leave rejected"}