from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.wfh_model import WFH
from app.models.employee_model import Employee

router = APIRouter(prefix="/wfh", tags=["WFH"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/request")
def request_wfh(data: dict, db: Session = Depends(get_db)):
    employee_id = data.get("employee_id")
    if not employee_id:
        raise HTTPException(status_code=400, detail="employee_id is required")
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    req = WFH(
        employee_id=employee_id,
        date=data.get("date"),
        reason=data.get("reason", ""),
        status="pending",
    )
    db.add(req)
    db.commit()
    return {"message": "WFH requested"}


@router.get("/")
def get_wfh(employee_id: int = Query(None), db: Session = Depends(get_db)):
    q = db.query(WFH)
    if employee_id is not None:
        q = q.filter(WFH.employee_id == employee_id)
    rows = q.all()
    return [
        {
            "id": r.id,
            "employee_id": r.employee_id,
            "date": str(r.date) if r.date else None,
            "reason": r.reason or "",
            "status": (r.status or "pending").lower(),
        }
        for r in rows
    ]


@router.put("/approve/{id}")
def approve_wfh(id: int, db: Session = Depends(get_db)):
    req = db.query(WFH).filter(WFH.id == id).first()
    req.status = "Approved"
    db.commit()
    return {"message": "WFH approved"}