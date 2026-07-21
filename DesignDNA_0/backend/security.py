from datetime import datetime, timedelta
from typing import Optional
import os

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from database import get_db
from models import User

# =====================================================
# SECURITY CONFIGURATION
# =====================================================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_KEY"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

REFRESH_TOKEN_EXPIRE_DAYS = 7

ADMIN_EMAIL_DOMAIN = "@designdna.ac.in"

# =====================================================
# PASSWORD HASHING
# =====================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# =====================================================
# HASH PASSWORD
# =====================================================

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# =====================================================
# VERIFY PASSWORD
# =====================================================

def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

def is_admin_email(email: str) -> bool:
    return email.lower().endswith(
        ADMIN_EMAIL_DOMAIN
    )

# =====================================================
# CREATE TOKEN
# =====================================================

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
):
    expire = datetime.utcnow() + (
        expires_delta
        or timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    )

    to_encode = data.copy()

    to_encode.update(
        {
            "exp": expire,
        }
    )

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

def create_refresh_token(
    data: dict,
):
    expire = datetime.utcnow() + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload = data.copy()

    payload.update(
        {
            "exp": expire,
            "type": "refresh",
        }
    )

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

# =====================================================
# VERIFY TOKEN
# =====================================================

def verify_access_token(
    token: str,
):
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

    except JWTError:
        return None
    

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials.",
)

# =====================================================
# CURRENT USER
# =====================================================

def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    token = request.cookies.get("accessToken")

    if not token:
        raise credentials_exception

    payload = verify_access_token(token)

    if payload is None:
        raise credentials_exception

    email = payload.get("sub")

    if email is None:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account disabled.",
        )

    return user

# =====================================================
# ADMIN ONLY
# =====================================================

def get_admin_user(
    current_user: User = Depends(
        get_current_user
    ),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Administrator privileges required.",
        )

    return current_user