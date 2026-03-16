"""Password hashing using bcrypt directly (avoids passlib/bcrypt compatibility issues)."""
import bcrypt


def hash_password(password: str) -> str:
    pwd = (password or "").encode("utf-8")[:72]
    return bcrypt.hashpw(pwd, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    if not password or not hashed:
        return False
    pwd = (password or "").encode("utf-8")[:72]
    try:
        return bcrypt.checkpw(pwd, hashed.encode("utf-8"))
    except Exception:
        return False
