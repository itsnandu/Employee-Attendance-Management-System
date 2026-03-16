from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user_model import User
from app.models.employee_model import Employee
from app.utils.password_hash import verify_password, hash_password
from app.utils.jwt_handler import create_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_employee_for_user(db: Session, email: str, name: str = None):
    """Create an Employee record if none exists for this email (for employee portal)."""
    existing = db.query(Employee).filter(Employee.email == email).first()
    if existing:
        return existing
    parts = (name or email.split("@")[0] or "User").strip().split(" ", 1)
    first_name = parts[0] if parts else "User"
    last_name = parts[1] if len(parts) > 1 else ""
    emp = Employee(
        first_name=first_name,
        last_name=last_name,
        email=email,
        department="General",
        position="Employee",
        status="active",
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


@router.post("/signup")
def signup(data: dict, db: Session = Depends(get_db)):
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return {"error": "Email and password are required"}

    if len(password) < 6:
        return {"error": "Password must be at least 6 characters"}

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return {"error": "Email already registered"}

    hashed = hash_password(password)
    role = data.get("role") or "employee"
    user = User(email=email, password=hashed, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto-create Employee record for employee role so useCurrentEmployee finds them
    if role == "employee":
        _ensure_employee_for_user(db, email, data.get("name"))

    token = create_token({"user_id": user.id})
    return {
        "token": token,
        "user": {"id": user.id, "email": user.email, "role": user.role},
    }


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == data["email"]).first()

    if not user:
        return {"error": "Invalid credentials"}

    if not verify_password(data["password"], user.password):
        return {"error": "Invalid credentials"}

    token = create_token({"user_id": user.id})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        },
    }