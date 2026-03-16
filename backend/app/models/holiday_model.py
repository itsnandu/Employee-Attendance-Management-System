from sqlalchemy import Column, Integer, String, Date
from app.database import Base


class Holiday(Base):
    __tablename__ = "holidays"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    holiday_date = Column(Date)
    type = Column(String(20), default="public")