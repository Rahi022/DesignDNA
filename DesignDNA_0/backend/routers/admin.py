from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from database import get_db

from models import (
    User,
    Analysis,
    LogoGeneration,
)

from security import get_admin_user

from schemas import LogoResponse, AnalysisResponse

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# =====================================================
# DASHBOARD STATISTICS
# =====================================================

@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):

    total_users = db.query(User).count()

    total_designs = db.query(Analysis).count()

    total_logos = db.query(LogoGeneration).count()

    average_score = (
        db.query(func.avg(Analysis.score))
        .scalar()
    )

    return {

        "total_users": total_users,

        "total_designs": total_designs,

        "total_logos": total_logos,

        "average_score": round(
            average_score or 0,
            1,
        ),

    }


# =====================================================
# GET USERS
# =====================================================

@router.get("/users")
def get_users(

    page: int = Query(1, ge=1),

    limit: int = Query(10, ge=1, le=100),

    search: str = "",

    db: Session = Depends(get_db),

    admin: User = Depends(get_admin_user),

):

    query = db.query(User)

    if search:

        query = query.filter(

            or_(

                User.name.ilike(f"%{search}%"),

                User.email.ilike(f"%{search}%"),

            )

        )

    total = query.count()

    users = (

        query

        .order_by(User.created_at.desc())

        .offset((page - 1) * limit)

        .limit(limit)

        .all()

    )

    def serialize_user(u: User):

        analysis_count = (
            db.query(Analysis)
            .filter(Analysis.user_id == u.id)
            .count()
        )

        logo_count = (
            db.query(LogoGeneration)
            .filter(LogoGeneration.user_id == u.id)
            .count()
        )

        avg_score = (
            db.query(func.avg(Analysis.score))
            .filter(Analysis.user_id == u.id)
            .scalar()
        )

        return {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at,
            "analysis_count": analysis_count,
            "logo_count": logo_count,
            "average_score": round(avg_score or 0, 1),
        }

    return {

        "page": page,

        "limit": limit,

        "total": total,

        "pages": (total + limit - 1) // limit,

        "users": [serialize_user(u) for u in users],

    }


# =====================================================
# USER DETAILS
# =====================================================

@router.get("/users/{user_id}")
def user_details(

    user_id: int,

    db: Session = Depends(get_db),

    admin: User = Depends(get_admin_user),

):

    user = (

        db.query(User)

        .filter(User.id == user_id)

        .first()

    )

    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found.",

        )

    analyses = (

        db.query(Analysis)

        .filter(Analysis.user_id == user.id)

        .count()

    )

    logos = (

        db.query(LogoGeneration)

        .filter(LogoGeneration.user_id == user.id)

        .count()

    )

    avg_score = (

        db.query(func.avg(Analysis.score))

        .filter(Analysis.user_id == user.id)

        .scalar()

    )

    return {

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "role": user.role,

        "is_active": user.is_active,

        "created_at": user.created_at,

        "analysis_count": analyses,

        "logo_count": logos,

        "average_score": round(avg_score or 0, 1),

    }


# =====================================================
# CHANGE ROLE
# =====================================================

@router.put("/users/{user_id}/role")
def change_role(

    user_id: int,

    role: str,

    db: Session = Depends(get_db),

    admin: User = Depends(get_admin_user),

):

    if role not in ["user", "admin"]:

        raise HTTPException(

            status_code=400,

            detail="Invalid role.",

        )

    user = (

        db.query(User)

        .filter(User.id == user_id)

        .first()

    )

    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found.",

        )

    user.role = role

    db.commit()

    return {

        "message": "Role updated.",

        "role": role,

    }


# =====================================================
# ENABLE / DISABLE USER
# =====================================================

@router.put("/users/{user_id}/status")
def toggle_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot disable yourself.",
        )

    user.is_active = not user.is_active

    db.commit()
    db.refresh(user)

    return {
        "message": "User status updated.",
        "is_active": user.is_active,
    }


# =====================================================
# DELETE USER
# =====================================================

@router.delete("/users/{user_id}")
def delete_user(

    user_id: int,

    db: Session = Depends(get_db),

    admin: User = Depends(get_admin_user),

):

    user = (

        db.query(User)

        .filter(User.id == user_id)

        .first()

    )

    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found.",

        )

    if user.id == admin.id:

        raise HTTPException(

            status_code=400,

            detail="You cannot delete yourself.",

        )

    db.delete(user)

    db.commit()

    return {

        "message": "User deleted successfully."

    }


@router.get("/analytics/prompts")
def prompt_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):

    prompts = (
        db.query(LogoGeneration.prompt)
        .all()
    )

    stats = {}

    for (prompt,) in prompts:
        stats[prompt] = stats.get(prompt, 0) + 1

    return [
        {
            "prompt": prompt,
            "count": count,
        }
        for prompt, count in sorted(
            stats.items(),
            key=lambda x: x[1],
            reverse=True,
        )
    ]


@router.get("/analytics")
def platform_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):

    return {

        "users": db.query(User).count(),

        "analyses": db.query(Analysis).count(),

        "logos": db.query(LogoGeneration).count(),

        "active_users": (
            db.query(User)
            .filter(User.is_active == True)
            .count()
        ),

    }

@router.get("/logos", response_model=list[LogoResponse])
def all_logos(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):

    logos = (
        db.query(LogoGeneration)
        .order_by(
            LogoGeneration.created_at.desc()
        )
        .all()
    )

    return logos


@router.get("/analyses", response_model=list[AnalysisResponse])
def all_analyses(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):

    analyses = (
        db.query(Analysis)
        .order_by(
            Analysis.created_at.desc()
        )
        .all()
    )

    return analyses