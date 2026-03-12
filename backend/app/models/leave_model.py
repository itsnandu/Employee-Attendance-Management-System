from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base

class Leave(Base):

    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    leave_type = Column(String(50))
    start_date = Column(Date)
    end_date = Column(Date)
    reason = Column(String(255))
    status = Column(String(50), default="Pending")