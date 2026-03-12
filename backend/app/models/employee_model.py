from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Employee(Base):

    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    # email = Column(String(100))
    department = Column(String(100))
    position = Column(String(100))
    phone_number = Column(String(20))
    joining_date = Column(Date)