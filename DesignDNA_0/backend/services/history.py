import json
from sqlalchemy.orm import Session

from models import Analysis


# =====================================================
# SAVE ANALYSIS
# =====================================================

def save_analysis(
    db: Session,
    user_id: int,
    image_name: str,
    image_path: str,
    result: dict,
):

    analysis = Analysis(

        user_id=user_id,

        image_name=image_name,

        image_path=image_path,

        score=result.get(
            "result",
            {}
        ).get(
            "score",
            0,
        ),

        brightness=result.get(
            "analysis",
            {}
        ).get(
            "brightness",
            0,
        ),

        contrast=result.get(
            "analysis",
            {}
        ).get(
            "contrast",
            0,
        ),

        sharpness=result.get(
            "analysis",
            {}
        ).get(
            "sharpness",
            0,
        ),

        edge_density=result.get(
            "analysis",
            {}
        ).get(
            "edge_density",
            0,
        ),

        whitespace=result.get(
            "analysis",
            {}
        ).get(
            "whitespace",
            0,
        ),

        dominant_colors=json.dumps(

            result.get(
                "colors",
                {}
            ).get(
                "dominant_colors",
                [],
            )

        ),

        color_harmony=result.get(
            "colors",
            {}
        ).get(
            "harmony",
            "",
        ),

        feedback=json.dumps(

            result.get(
                "feedback",
                [],
            )

        ),
    )

    # Future-compatible fields

    if hasattr(analysis, "processing_time"):

        analysis.processing_time = result.get(
            "processing_time",
            0,
        )

    if hasattr(analysis, "analysis_version"):

        analysis.analysis_version = result.get(
            "analysis_version",
            "2.2",
        )

    if hasattr(analysis, "ai_feedback"):

        analysis.ai_feedback = json.dumps(

            result.get(
                "feedback",
                [],
            )

        )

    db.add(analysis)

    db.commit()

    db.refresh(analysis)

    return analysis


# =====================================================
# USER HISTORY
# =====================================================

def get_user_analysis_history(
    db: Session,
    user_id: int,
):

    return (

        db.query(Analysis)

        .filter(
            Analysis.user_id == user_id
        )

        .order_by(
            Analysis.created_at.desc()
        )

        .all()

    )


# =====================================================
# SINGLE ANALYSIS
# =====================================================

def get_analysis(
    db: Session,
    analysis_id: int,
):

    return (

        db.query(Analysis)

        .filter(
            Analysis.id == analysis_id
        )

        .first()

    )


# =====================================================
# ADMIN
# =====================================================

def get_all_analyses(
    db: Session,
):

    return (

        db.query(Analysis)

        .order_by(
            Analysis.created_at.desc()
        )

        .all()

    )


# =====================================================
# DASHBOARD
# =====================================================

def total_analyses(
    db: Session,
):

    return db.query(
        Analysis
    ).count()