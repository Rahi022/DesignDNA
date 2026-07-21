import time
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models import (
    LogoGeneration,
    User,
)

from security import get_current_user

from schemas import (
    LogoGenerateRequest,
    LogoResponse,
    MessageResponse,
)

from services.logo import (
    create_ai_logo,
    save_logo,
    get_user_logos,
    delete_logo,
)

router = APIRouter(
    prefix="/logo",
    tags=["Logo Generator"],
)

# =====================================================
# GENERATE
# =====================================================

@router.post(
    "/generate",
    response_model=LogoResponse,
)
def generate_logo(
    request: LogoGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    start = time.time()

    image_path, used_ai, model_name = create_ai_logo(
        prompt=request.prompt,
        style=request.style,
        negative_prompt=request.negative_prompt,
        colors=request.colors,
    )

    generation_time = round(time.time() - start, 3)

    logo = save_logo(
        db=db,
        user_id=current_user.id,
        prompt=request.prompt,
        style=request.style,
        image_path=image_path,
    )

    # Future fields
    if hasattr(logo, "negative_prompt"):
        logo.negative_prompt = request.negative_prompt

    if hasattr(logo, "colors"):
        if request.colors:
            logo.colors = ",".join(request.colors)

    if hasattr(logo, "model"):
        logo.model = model_name

    if hasattr(logo, "generation_time"):
        logo.generation_time = generation_time

    db.commit()
    db.refresh(logo)

    return logo


# =====================================================
# USER HISTORY
# =====================================================

@router.get(
    "/history",
    response_model=list[LogoResponse],
)
def logo_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    logos = (
        db.query(LogoGeneration)
        .filter(
            LogoGeneration.user_id == current_user.id
        )
        .order_by(
            LogoGeneration.created_at.desc()
        )
        .all()
    )

    return logos


# =====================================================
# FAVORITE
# =====================================================

@router.put(
    "/{logo_id}/favorite",
    response_model=MessageResponse,
)
def favorite_logo(
    logo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    logo = (
        db.query(LogoGeneration)
        .filter(
            LogoGeneration.id == logo_id,
            LogoGeneration.user_id == current_user.id,
        )
        .first()
    )

    if not logo:
        raise HTTPException(
            status_code=404,
            detail="Logo not found.",
        )

    if hasattr(logo, "is_favorite"):
        logo.is_favorite = not logo.is_favorite

    db.commit()

    return {
        "message": "Favorite updated."
    }


# =====================================================
# DOWNLOAD
# =====================================================

@router.post(
    "/{logo_id}/download",
    response_model=MessageResponse,
)
def download_logo(
    logo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    logo = (
        db.query(LogoGeneration)
        .filter(
            LogoGeneration.id == logo_id,
            LogoGeneration.user_id == current_user.id,
        )
        .first()
    )

    if not logo:
        raise HTTPException(
            status_code=404,
            detail="Logo not found.",
        )

    if hasattr(logo, "download_count"):
        logo.download_count += 1

    db.commit()

    return {
        "message": "Download recorded."
    }


# =====================================================
# DELETE
# =====================================================

@router.delete(
    "/{logo_id}",
    response_model=MessageResponse,
)
def remove_logo(
    logo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    logo = (
        db.query(LogoGeneration)
        .filter(
            LogoGeneration.id == logo_id,
            LogoGeneration.user_id == current_user.id,
        )
        .first()
    )

    if not logo:
        raise HTTPException(
            status_code=404,
            detail="Logo not found.",
        )

    # Soft delete if available
    if hasattr(logo, "is_deleted"):
        logo.is_deleted = True
        db.commit()
    else:
        delete_logo(db, logo)

    return {
        "message": "Logo deleted successfully."
    }