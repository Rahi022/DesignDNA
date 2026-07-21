from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from models import (
    User,
    Analysis,
    LogoGeneration,
)

# =====================================================
# USER DASHBOARD
# =====================================================

def get_dashboard_stats(
    db: Session,
    user_id: int,
):

    analyses = (
        db.query(Analysis)
        .filter(
            Analysis.user_id == user_id
        )
        .all()
    )

    logos = (
        db.query(LogoGeneration)
        .filter(
            LogoGeneration.user_id == user_id
        )
        .all()
    )

    total_designs = len(analyses)

    total_logos = len(logos)

    average_score = (
        round(
            sum(a.score for a in analyses) / total_designs,
            1,
        )
        if total_designs
        else 0
    )

    highest_score = (
        max(
            (a.score for a in analyses),
            default=0,
        )
    )

    lowest_score = (
        min(
            (a.score for a in analyses),
            default=0,
        )
    )

    favorite_logos = sum(
        1
        for logo in logos
        if getattr(
            logo,
            "is_favorite",
            False,
        )
    )

    total_downloads = sum(
        getattr(
            logo,
            "download_count",
            0,
        )
        for logo in logos
    )

    latest_analysis = (
        analyses[0].created_at
        if analyses
        else None
    )

    latest_logo = (
        logos[0].created_at
        if logos
        else None
    )

    return {

        "designs_analyzed": total_designs,

        "logos_generated": total_logos,

        "average_score": average_score,

        "highest_score": highest_score,

        "lowest_score": lowest_score,

        "favorite_logos": favorite_logos,

        "downloads": total_downloads,

        "latest_analysis": latest_analysis,

        "latest_logo": latest_logo,

    }


# =====================================================
# ADMIN DASHBOARD
# =====================================================

def get_admin_dashboard_stats(
    db: Session,
):

    total_users = db.query(User).count()

    active_users = (
        db.query(User)
        .filter(
            User.is_active == True
        )
        .count()
    )

    total_analyses = (
        db.query(Analysis)
        .count()
    )

    total_logos = (
        db.query(LogoGeneration)
        .count()
    )

    average_score = (
        db.query(
            func.avg(
                Analysis.score
            )
        )
        .scalar()
    )

    if average_score is None:
        average_score = 0

    total_downloads = sum(

        getattr(
            logo,
            "download_count",
            0,
        )

        for logo in db.query(
            LogoGeneration
        ).all()

    )

    favorite_logos = sum(

        1

        for logo in db.query(
            LogoGeneration
        ).all()

        if getattr(
            logo,
            "is_favorite",
            False,
        )

    )

    seven_days = datetime.utcnow() - timedelta(days=7)

    new_users = (
        db.query(User)
        .filter(
            User.created_at >= seven_days
        )
        .count()
    )

    return {

        "total_users": total_users,

        "active_users": active_users,

        "new_users": new_users,

        "total_logos": total_logos,

        "total_analyses": total_analyses,

        "average_score": round(
            average_score,
            1,
        ),

        "downloads": total_downloads,

        "favorite_logos": favorite_logos,

    }


# =====================================================
# PROMPT ANALYTICS
# =====================================================

def get_prompt_statistics(
    db: Session,
):

    prompts = (

        db.query(
            LogoGeneration.prompt
        )

        .all()

    )

    frequency = {}

    for (prompt,) in prompts:

        frequency[prompt] = (
            frequency.get(
                prompt,
                0,
            )
            + 1
        )

    return sorted(

        frequency.items(),

        key=lambda x: x[1],

        reverse=True,

    )[:20]


# =====================================================
# STYLE ANALYTICS
# =====================================================

def get_style_statistics(
    db: Session,
):

    styles = (

        db.query(
            LogoGeneration.style
        )

        .all()

    )

    frequency = {}

    for (style,) in styles:

        frequency[style] = (
            frequency.get(
                style,
                0,
            )
            + 1
        )

    return sorted(

        frequency.items(),

        key=lambda x: x[1],

        reverse=True,

    )


# =====================================================
# PLATFORM STATISTICS
# =====================================================

def get_platform_statistics(
    db: Session,
):

    return {

        "users": db.query(User).count(),

        "logos": db.query(
            LogoGeneration
        ).count(),

        "analyses": db.query(
            Analysis
        ).count(),

    }