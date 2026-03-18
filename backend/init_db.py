"""
Create the attendance_db database and all tables.
Run: python init_db.py
"""
from urllib.parse import urlparse
import pymysql
from sqlalchemy import create_engine, text
from app.database import Base, DATABASE_URL

# Parse DATABASE_URL: mysql+pymysql://user:pass@host/dbname
parsed = urlparse(DATABASE_URL.replace("mysql+pymysql://", "mysql://"))
db_name = parsed.path.lstrip("/") or "attendance"
db_user = parsed.username or "root"
db_pass = parsed.password or ""
db_host = parsed.hostname or "localhost"

def create_database():
    """Create database if it doesn't exist."""
    conn = pymysql.connect(host=db_host, user=db_user, password=db_pass)
    try:
        with conn.cursor() as cur:
            cur.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        print(f"Database '{db_name}' ready.")
    finally:
        conn.close()

def create_tables():
    """Create all tables from models."""
    from app.models import (  # noqa: F401 - import to register models
        user_model,
        employee_model,
        attendance_model,
        leave_model,
        holiday_model,
        announcement_model,
        payroll_model,
        wfh_model,
    )
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    print("Tables created.")


def migrate_employee_columns():
    """Add new columns to employees table if they don't exist."""
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        for col, col_type in [("email", "VARCHAR(100)"), ("salary", "FLOAT"), ("status", "VARCHAR(20)")]:
            try:
                conn.execute(text(f"ALTER TABLE employees ADD COLUMN {col} {col_type}"))
                conn.commit()
                print(f"Added column employees.{col}")
            except Exception:
                conn.rollback()


def migrate_announcement_columns():
    """Add date and tag columns to announcements if not exist."""
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        for col, col_type in [("date", "DATE"), ("tag", "VARCHAR(50)")]:
            try:
                conn.execute(text(f"ALTER TABLE announcements ADD COLUMN {col} {col_type}"))
                conn.commit()
                print(f"Added column announcements.{col}")
            except Exception:
                conn.rollback()


def migrate_holiday_type():
    """Add type column to holidays if not exists."""
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE holidays ADD COLUMN type VARCHAR(20) DEFAULT 'public'"))
            conn.commit()
            print("Added column holidays.type")
        except Exception:
            conn.rollback()

def seed_admin():
    """Add default admin user if none exists."""
    try:
        from app.database import SessionLocal
        from app.models.user_model import User

        # Use bcrypt directly if passlib fails (version compatibility)
        try:
            from app.utils.password_hash import hash_password
            hashed = hash_password("admin123")
        except Exception:
            import bcrypt
            hashed = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode()

        db = SessionLocal()
        try:
            if db.query(User).filter(User.email == "admin@eams.com").first():
                print("Admin user already exists.")
                return
            admin = User(email="admin@eams.com", password=hashed, role="admin")
            db.add(admin)
            db.commit()
            print("Admin user created: admin@eams.com / admin123")
        finally:
            db.close()
    except Exception as e:
        print(f"Could not seed admin (add users manually): {e}")


def seed_employee_user():
    """Add test employee user + employee record for employee portal demo."""
    try:
        from app.database import SessionLocal
        from app.models.user_model import User
        from app.models.employee_model import Employee
        from datetime import date

        try:
            from app.utils.password_hash import hash_password
            hashed = hash_password("test123")
        except Exception:
            import bcrypt
            hashed = bcrypt.hashpw(b"test123", bcrypt.gensalt()).decode()

        db = SessionLocal()
        try:
            user_exists = db.query(User).filter(User.email == "employee@test.com").first()
            if not user_exists:
                user = User(email="employee@test.com", password=hashed, role="employee")
                db.add(user)
                db.commit()
                print("Employee user created: employee@test.com / test123")

            # Always ensure Employee record exists (useCurrentEmployee matches by email)
            emp = db.query(Employee).filter(Employee.email == "employee@test.com").first()
            if not emp:
                emp = Employee(
                    first_name="Test",
                    last_name="Employee",
                    email="employee@test.com",
                    department="Engineering",
                    position="Software Engineer",
                    phone_number="+91 98765 43210",
                    joining_date=date.today(),
                    salary=50000.0,
                    status="active",
                )
                db.add(emp)
                db.commit()
                print("Employee record created for employee@test.com")
            elif not user_exists:
                print("Employee record already exists for employee@test.com")
        finally:
            db.close()
    except Exception as e:
        print(f"Could not seed employee user: {e}")


if __name__ == "__main__":
    create_database()
    create_tables()
    migrate_employee_columns()
    migrate_announcement_columns()
    migrate_holiday_type()
    seed_admin()
    seed_employee_user()
    print("Done.")
