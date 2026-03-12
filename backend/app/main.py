from fastapi import FastAPI

from app.routes import (
employee_routes,
attendance_routes,
leave_routes,
holiday_routes,
announcement_routes,
payroll_routes,
wfh_routes,
report_routes
)

app = FastAPI()

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