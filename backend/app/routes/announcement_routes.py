from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.announcement_model import Announcement

router = APIRouter(prefix="/announcements", tags=["Announcements"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def get_announcements(db: Session = Depends(get_db)):
    anns = db.query(Announcement).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "message": a.message,
            "msg": a.message,
            "date": str(a.date) if a.date else (str(a.created_at)[:10] if a.created_at else None),
            "tag": a.tag or "HR",
            "created_at": str(a.created_at) if a.created_at else None,
        }
        for a in anns
    ]


@router.post("/")
def create_announcement(data: dict = Body(default={}), db: Session = Depends(get_db)):
    payload = {
        "title": data.get("title", ""),
        "message": data.get("message") or data.get("msg", ""),
        "tag": data.get("tag", "HR"),
    }
    if data.get("date"):
        from datetime import datetime
        try:
            payload["date"] = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except Exception:
            pass
    ann = Announcement(**payload)
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return {"id": ann.id, "message": "Announcement created"}


@router.put("/{announcement_id}")
def update_announcement(announcement_id: int, data: dict = Body(default={}), db: Session = Depends(get_db)):
    ann = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Not found")
    if data.get("title") is not None:
        ann.title = data["title"]
    if data.get("message") is not None:
        ann.message = data["message"]
    if data.get("msg") is not None:
        ann.message = data["msg"]
    if data.get("tag") is not None:
        ann.tag = data["tag"]
    if data.get("date"):
        from datetime import datetime
        try:
            ann.date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        except Exception:
            pass
    db.commit()
    return {"message": "Updated"}


@router.delete("/{announcement_id}")
def delete_announcement(announcement_id: int, db: Session = Depends(get_db)):
    ann = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not ann:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(ann)
    db.commit()
    return {"message": "Deleted"}