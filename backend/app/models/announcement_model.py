from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base


class Announcement(Base):

    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)