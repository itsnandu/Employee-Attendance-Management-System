from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "attendance-secret"
ALGORITHM = "HS256"

def create_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(hours=10)

    payload.update({"exp": expire})

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)