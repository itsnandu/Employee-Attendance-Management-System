from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.leave_model import Leave

router = APIRouter(prefix="/leave", tags=["Leave"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/apply")
def apply_leave(data: dict, db: Session = Depends(get_db)):
    leave = Leave(**data)
    db.add(leave)
    db.commit()
    return {"message": "Leave applied"}


@router.get("/")
def get_leaves(db: Session = Depends(get_db)):
    return db.query(Leave).all()


@router.put("/approve/{id}")
def approve_leave(id: int, db: Session = Depends(get_db)):
    leave = db.query(Leave).filter(Leave.id == id).first()
    leave.status = "Approved"
    db.commit()
    return {"message": "Leave approved"}