from datetime import datetime, timedelta
from urllib import response

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
)

from security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    get_current_user,
    is_admin_email,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# =====================================================
# REGISTER
# =====================================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    # Public registration cannot create admins
    if is_admin_email(user.email):
        raise HTTPException(
            status_code=403,
            detail="Administrator accounts cannot be created using public registration.",
        )

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=get_password_hash(
            user.password
        ),
        role="user",
        is_active=True,
        is_verified=False,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =====================================================
# LOGIN
# =====================================================

@router.post(
    "/login",
    response_model=Token,
)
def login_user(
    user: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    if not verify_password(
        user.password,
        existing_user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password.",
        )

    if not existing_user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Your account has been disabled.",
        )

    # Update login timestamp
    existing_user.last_login = datetime.utcnow()

    db.commit()

    access_token = create_access_token(
        data={
            "sub": existing_user.email,
            "role": existing_user.role,
        },
        expires_delta=timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )

    response.set_cookie(
        key="accessToken",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    response.set_cookie(
        key="role",
        value=existing_user.role,
        httponly=False,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    refresh_token = create_refresh_token(
        {
            "sub": existing_user.email,
        }
    )

    existing_user.refresh_token = refresh_token

    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


# =====================================================
# CURRENT USER
# =====================================================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):
    return current_user


# =====================================================
# LOGOUT
# =====================================================

@router.post("/logout")
def logout(
    response: Response,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    current_user.refresh_token = None

    db.commit()

    response.delete_cookie("accessToken")
    response.delete_cookie("role")

    return {
        "message": "Logged out successfully."
    }