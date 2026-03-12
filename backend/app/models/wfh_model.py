from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base


class WFH(Base):

    __tablename__ = "wfh_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(Date)
    reason = Column(String(255))
    status = Column(String(50), default="Pending")