from sqlalchemy import Column, Integer, Date, Time, String, ForeignKey
from app.database import Base

class Attendance(Base):

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(Date)
    mark_attendance = Column(Time, nullable=False)   
    status = Column(String(50))