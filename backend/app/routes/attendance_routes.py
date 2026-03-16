from datetime import date, time
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


def _parse_time(val):
    """Parse time string HH:MM, HH:MM:SS, or HH:MM AM/PM to time object."""
    if val is None:
        return None
    if hasattr(val, "hour"):
        return val
    s = str(val).strip().upper()
    if "AM" in s or "PM" in s:
        import re
        m = re.search(r"(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)", s)
        if m:
            h, m_, sec = int(m.group(1)), int(m.group(2)), int(m.group(3) or 0)
            if m.group(4) == "PM" and h != 12:
                h += 12
            elif m.group(4) == "AM" and h == 12:
                h = 0
            return time(h, m_, sec)
    parts = s.replace("AM", "").replace("PM", "").split(":")
    if len(parts) >= 2:
        h, m = int(parts[0] or 0), int(parts[1] or 0)
        sec = int("".join(c for c in str(parts[2] or 0) if c.isdigit()) or 0) if len(parts) > 2 else 0
        return time(h, m, sec)
    return None


def _att_to_dict(a):
    return {
        "id": a.id,
        "employee_id": a.employee_id,
        "date": str(a.date) if a.date else None,
        "check_in": str(a.check_in_time) if a.check_in_time else None,
        "check_out": str(a.check_out_time) if a.check_out_time else None,
        "status": a.status,
    }


@router.post("/checkin")
def checkin(data: dict, db: Session = Depends(get_db)):
    record = Attendance(
        employee_id=data["employee_id"],
        date=data.get("date") or str(date.today()),
        check_in_time=_parse_time(data.get("check_in") or data.get("check_in_time") or "09:00:00"),
        status=data.get("status") or "Present",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"message": "Checked in", "id": record.id}


@router.post("/checkout")
def checkout(data: dict, db: Session = Depends(get_db)):
    emp_id = data["employee_id"]
    att_date = data.get("date") or str(date.today())
    record = (
        db.query(Attendance)
        .filter(Attendance.employee_id == emp_id, Attendance.date == att_date)
        .order_by(Attendance.id.desc())
        .first()
    )
    if not record:
        return {"error": "No check-in record found for today"}
    record.check_out_time = _parse_time(data.get("check_out") or data.get("check_out_time"))
    db.commit()
    return {"message": "Checked out"}


@router.get("/")
def get_attendance(db: Session = Depends(get_db)):
    records = db.query(Attendance).all()
    return [_att_to_dict(a) for a in records]


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Dashboard stats: present, absent, late, total for today."""
    today = str(date.today())
    records = db.query(Attendance).filter(Attendance.date == today).all()
    present = len(records)
    from app.models.employee_model import Employee
    total = db.query(Employee).count()
    absent = max(0, total - present)
    late_threshold = time(9, 30, 0)
    late = sum(1 for r in records if r.check_in_time and r.check_in_time > late_threshold)
    return {"present": present, "absent": absent, "late": late, "total": total}