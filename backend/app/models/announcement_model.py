from sqlalchemy import Column, Integer, String, Text, DateTime, Date
from datetime import datetime
from app.database import Base


class Announcement(Base):

    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    message = Column(Text)
    date = Column(Date, default=datetime.utcnow)
    tag = Column(String(50), default="HR")
    created_at = Column(DateTime, default=datetime.utcnow)