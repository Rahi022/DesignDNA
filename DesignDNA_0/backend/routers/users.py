import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from database import get_db
from models import User, Analysis, LogoGeneration
from security import get_current_user, get_password_hash, verify_password

from schemas import (
    UpdateProfileRequest,
    ChangePasswordRequest,
    UserResponse,
    UserStatsResponse,
    MessageResponse,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

AVATAR_DIR = Path("uploads/avatars")
AVATAR_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_AVATAR_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}


# =====================================================
# UPDATE PROFILE
# =====================================================

@router.put(
    "/profile",
    response_model=UserResponse,
)
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if data.name is not None:
        current_user.name = data.name

    if data.avatar_url is not None:
        current_user.avatar_url = data.avatar_url

    db.commit()
    db.refresh(current_user)

    return current_user


# =====================================================
# CHANGE PASSWORD
# =====================================================

@router.put(
    "/change-password",
    response_model=MessageResponse,
)
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if not verify_password(
        data.current_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect.",
        )

    current_user.hashed_password = get_password_hash(data.new_password)

    db.commit()

    return {
        "message": "Password updated successfully."
    }


# =====================================================
# UPLOAD AVATAR
# =====================================================

@router.post(
    "/avatar",
    response_model=UserResponse,
)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_AVATAR_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format.",
        )

    filename = f"{uuid.uuid4()}{extension}"
    filepath = AVATAR_DIR / filename

    contents = await file.read()

    with open(filepath, "wb") as image:
        image.write(contents)

    current_user.avatar_url = "/" + str(filepath).replace("\\", "/")

    db.commit()
    db.refresh(current_user)

    return current_user


# =====================================================
# USER STATISTICS
# =====================================================

@router.get(
    "/stats",
    response_model=UserStatsResponse,
)
def user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    logos = (
        db.query(LogoGeneration)
        .filter(LogoGeneration.user_id == current_user.id)
        .all()
    )

    analyses_count = (
        db.query(Analysis)
        .filter(Analysis.user_id == current_user.id)
        .count()
    )

    downloads = sum(
        getattr(logo, "download_count", 0) for logo in logos
    )

    favorites = sum(
        1 for logo in logos if getattr(logo, "is_favorite", False)
    )

    return {
        "logos_generated": len(logos),
        "logos_analyzed": analyses_count,
        "downloads": downloads,
        "favorites": favorites,
    }


# =====================================================
# DELETE ACCOUNT
# =====================================================

@router.delete(
    "/delete",
    response_model=MessageResponse,
)
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    db.delete(current_user)
    db.commit()

    return {
        "message": "Account deleted successfully."
    }
