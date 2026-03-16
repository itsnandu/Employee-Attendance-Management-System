from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import (
    auth_routes,
    employee_routes,
    attendance_routes,
    leave_routes,
    holiday_routes,
    announcement_routes,
    payroll_routes,
    wfh_routes,
    report_routes,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(employee_routes.router)
app.include_router(attendance_routes.router)
app.include_router(leave_routes.router)
app.include_router(holiday_routes.router)
app.include_router(announcement_routes.router)
app.include_router(payroll_routes.router)
app.include_router(wfh_routes.router)
app.include_router(report_routes.router)


@app.get("/")
def home():
    return {"message": "Employee Attendance Backend Running"}