# from datetime import date, time
# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from app.database import SessionLocal
# from app.models.attendance_model import Attendance

# router = APIRouter(prefix="/attendance", tags=["Attendance"])


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# def _parse_time(val):
#     """Parse time string HH:MM, HH:MM:SS, or HH:MM AM/PM to time object."""
#     if val is None:
#         return None
#     if hasattr(val, "hour"):
#         return val
#     s = str(val).strip().upper()
#     if "AM" in s or "PM" in s:
#         import re
#         m = re.search(r"(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)", s)
#         if m:
#             h, m_, sec = int(m.group(1)), int(m.group(2)), int(m.group(3) or 0)
#             if m.group(4) == "PM" and h != 12:
#                 h += 12
#             elif m.group(4) == "AM" and h == 12:
#                 h = 0
#             return time(h, m_, sec)
#     parts = s.replace("AM", "").replace("PM", "").split(":")
#     if len(parts) >= 2:
#         h, m = int(parts[0] or 0), int(parts[1] or 0)
#         sec = int("".join(c for c in str(parts[2] or 0) if c.isdigit()) or 0) if len(parts) > 2 else 0
#         return time(h, m, sec)
#     return None


# def _att_to_dict(a):
#     return {
#         "id": a.id,
#         "employee_id": a.employee_id,
#         "date": str(a.date) if a.date else None,
#         "check_in": str(a.check_in_time) if a.check_in_time else None,
#         "check_out": str(a.check_out_time) if a.check_out_time else None,
#         "status": a.status,
#     }


# @router.post("/checkin")
# def checkin(data: dict, db: Session = Depends(get_db)):
#     record = Attendance(
#         employee_id=data["employee_id"],
#         date=data.get("date") or str(date.today()),
#         mark_attendance =_parse_time(data.get("check_in") or data.get("check_in_time") or "09:00:00"),
#         status=data.get("status") or "Present",
#     )
#     db.add(record)
#     db.commit()
#     db.refresh(record)
#     return {"message": "Checked in", "id": record.id}


# @router.post("/checkout")
# def checkout(data: dict, db: Session = Depends(get_db)):
#     emp_id = data["employee_id"]
#     att_date = data.get("date") or str(date.today())
#     record = (
#         db.query(Attendance)
#         .filter(Attendance.employee_id == emp_id, Attendance.date == att_date)
#         .order_by(Attendance.id.desc())
#         .first()
#     )
#     if not record:
#         return {"error": "No check-in record found for today"}
#     record.check_out_time = _parse_time(data.get("check_out") or data.get("check_out_time"))
#     db.commit()
#     return {"message": "Checked out"}


# @router.get("/")
# def get_attendance(db: Session = Depends(get_db)):
#     records = db.query(Attendance).all()
#     return [_att_to_dict(a) for a in records]


# @router.get("/stats")
# def get_stats(db: Session = Depends(get_db)):
#     """Dashboard stats: present, absent, late, total for today."""
#     today = str(date.today())
#     records = db.query(Attendance).filter(Attendance.date == today).all()
#     present = len(records)
#     from app.models.employee_model import Employee
#     total = db.query(Employee).count()
#     absent = max(0, total - present)
#     late_threshold = time(9, 30, 0)
#     late = sum(1 for r in records if r.check_in_time and r.check_in_time > late_threshold)
#     return {"present": present, "absent": absent, "late": late, "total": total}

"""
Attendance routes — simple Mark Attendance concept:
  Every button tap → one new row inserted with the current timestamp.
  No check-in / check-out logic. No session pairing.
  Admin sees all taps for a given employee+date ordered by time.
  First tap of the day = check-in time shown on admin panel.
  Last tap of the day  = check-out time shown on admin panel.
"""

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
    """Parse time string like '11:55:41 am', 'HH:MM:SS', 'HH:MM' to a time object."""
    if val is None:
        return None
    if hasattr(val, "hour"):
        return val
    import re
    s = str(val).strip().upper()
    m = re.search(r"(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?", s)
    if m:
        h  = int(m.group(1))
        mi = int(m.group(2))
        sc = int(m.group(3) or 0)
        ap = m.group(4)
        if ap == "PM" and h != 12:
            h += 12
        elif ap == "AM" and h == 12:
            h = 0
        try:
            return time(h, mi, sc)
        except ValueError:
            return None
    return None


def _att_to_dict(a):
    return {
        "id":              a.id,
        "employee_id":     a.employee_id,
        "date":            str(a.date) if a.date else None,
        "mark_attendance": str(a.mark_attendance) if a.mark_attendance else None,
        "status":          a.status,
    }


@router.post("/mark")
def mark_attendance(data: dict, db: Session = Depends(get_db)):
    """
    Single endpoint for Mark Attendance button.
    Every tap creates a new row — no pairing, no check-in/out concept.
    """
    emp_id   = data["employee_id"]
    att_date = data.get("date") or str(date.today())
    t        = _parse_time(data.get("mark_attendance") or data.get("time"))

    if t is None:
        from datetime import datetime
        t = datetime.now().time().replace(microsecond=0)

    record = Attendance(
        employee_id     = emp_id,
        date            = att_date,
        mark_attendance = t,
        status          = data.get("status") or "Present",
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"message": "Attendance marked", "id": record.id, "time": str(t)}


# Keep /checkin and /checkout as aliases so existing frontend calls still work
@router.post("/checkin")
def checkin(data: dict, db: Session = Depends(get_db)):
    """Alias → mark attendance (first tap of day)."""
    data["mark_attendance"] = data.get("check_in") or data.get("check_in_time")
    return mark_attendance(data, db)


@router.post("/checkout")
def checkout(data: dict, db: Session = Depends(get_db)):
    """Alias → mark attendance (subsequent tap)."""
    data["mark_attendance"] = data.get("check_out") or data.get("check_out_time")
    return mark_attendance(data, db)


@router.get("/")
def get_attendance(db: Session = Depends(get_db)):
    """
    Returns all records. For each employee+date the frontend can derive:
      first tap = check-in time  (min mark_attendance)
      last  tap = check-out time (max mark_attendance)
    """
    records = db.query(Attendance).order_by(Attendance.date, Attendance.mark_attendance).all()
    return [_att_to_dict(a) for a in records]


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Dashboard stats for today: unique employees who tapped today = present."""
    today = str(date.today())

    # Distinct employees who have at least one tap today
    from sqlalchemy import func, distinct
    rows = db.query(Attendance).filter(Attendance.date == today).all()

    present_emp_ids = set(r.employee_id for r in rows)
    present = len(present_emp_ids)

    from app.models.employee_model import Employee
    total  = db.query(Employee).count()
    absent = max(0, total - present)

    late_threshold = time(9, 30, 0)
    # An employee is late if their FIRST tap of the day is after 9:30
    first_taps = {}
    for r in rows:
        if r.employee_id not in first_taps or r.mark_attendance < first_taps[r.employee_id]:
            first_taps[r.employee_id] = r.mark_attendance

    late = sum(1 for t_val in first_taps.values() if t_val and t_val > late_threshold)
    return {"present": present, "absent": absent, "late": late, "total": total}
