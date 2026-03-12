from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.wfh_model import WFH

router = APIRouter(prefix="/wfh", tags=["WFH"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/request")
def request_wfh(data: dict, db: Session = Depends(get_db)):
    req = WFH(**data)
    db.add(req)
    db.commit()
    return {"message": "WFH requested"}


@router.get("/")
def get_wfh(db: Session = Depends(get_db)):
    return db.query(WFH).all()


@router.put("/approve/{id}")
def approve_wfh(id: int, db: Session = Depends(get_db)):
    req = db.query(WFH).filter(WFH.id == id).first()
    req.status = "Approved"
    db.commit()
    return {"message": "WFH approved"}