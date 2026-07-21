import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import Analysis, User
from security import get_current_user

router = APIRouter(
    prefix="/history",
    tags=["History"],
)

# =====================================================
# USER HISTORY
# =====================================================

@router.get("")
def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    offset = (page - 1) * limit

    analyses = (
        db.query(Analysis)
        .filter(
            Analysis.user_id == current_user.id
        )
        .order_by(
            Analysis.created_at.desc()
        )
        .offset(offset)
        .limit(limit)
        .all()
    )

    total = (
        db.query(Analysis)
        .filter(
            Analysis.user_id == current_user.id
        )
        .count()
    )

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "items": [
            {
                "id": analysis.id,
                "image_name": analysis.image_name,
                "image_path": "/" + analysis.image_path.replace("\\", "/"),
                "score": analysis.score,
                "created_at": analysis.created_at,
            }
            for analysis in analyses
        ],
    }

# =====================================================
# SINGLE ANALYSIS
# =====================================================

@router.get("/{analysis_id}")
def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id,
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    response = {
        "id": analysis.id,
        "image_name": analysis.image_name,
        "image_path": "/" + analysis.image_path.replace("\\", "/"),
        "score": analysis.score,
        "brightness": analysis.brightness,
        "contrast": analysis.contrast,
        "sharpness": analysis.sharpness,
        "edge_density": analysis.edge_density,
        "whitespace": analysis.whitespace,
        "dominant_colors": json.loads(
            analysis.dominant_colors
        ) if analysis.dominant_colors else [],
        "color_harmony": analysis.color_harmony,
        "feedback": json.loads(
            analysis.feedback
        ) if analysis.feedback else [],
        "created_at": analysis.created_at,
    }

    # Future-compatible fields
    if hasattr(analysis, "analysis_version"):
        response["analysis_version"] = analysis.analysis_version

    if hasattr(analysis, "processing_time"):
        response["processing_time"] = analysis.processing_time

    if hasattr(analysis, "ai_feedback"):
        response["ai_feedback"] = analysis.ai_feedback

    return response

# =====================================================
# DELETE ANALYSIS
# =====================================================

@router.delete("/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    analysis = (
        db.query(Analysis)
        .filter(
            Analysis.id == analysis_id,
            Analysis.user_id == current_user.id,
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found.",
        )

    db.delete(analysis)
    db.commit()

    return {
        "message": "Analysis deleted successfully."
    }