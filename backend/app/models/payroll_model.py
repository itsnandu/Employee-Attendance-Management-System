from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.database import Base


class Payroll(Base):

    __tablename__ = "payroll"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    month = Column(String(20))
    salary = Column(Float)
    bonus = Column(Float)
    deduction = Column(Float)