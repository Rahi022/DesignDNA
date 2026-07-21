import os
import uuid
import time
from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from database import get_db
from models import User, Analysis
from security import get_current_user

from services.analysis import analyze_image_file
from services.dashboard import get_dashboard_stats
from services.history import save_analysis

router = APIRouter(
    tags=["AI Analysis"],
)

# =====================================================
# CONFIG
# =====================================================

UPLOAD_FOLDER = Path("uploads/analysis")
UPLOAD_FOLDER.mkdir(
    parents=True,
    exist_ok=True,
)

ALLOWED_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
}

# =====================================================
# HOME
# =====================================================

@router.get("/")
def home():

    return {
        "application": "DesignDNA Backend",
        "version": "2.2",
        "status": "running",
    }

# =====================================================
# ANALYZE IMAGE
# =====================================================

@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format.",
        )

    filename = f"{uuid.uuid4()}{extension}"

    filepath = UPLOAD_FOLDER / filename

    contents = await file.read()

    with open(filepath, "wb") as image:
        image.write(contents)

    start = time.time()

    result = analyze_image_file(contents)

    processing_time = round(
        time.time() - start,
        3,
    )

    save_analysis(
        db=db,
        user_id=current_user.id,
        image_name=file.filename,
        image_path=str(filepath),
        result=result,
    )

    # Future compatibility
    result["processing_time"] = processing_time
    result["analysis_version"] = "2.2"

    return result

# =====================================================
# USER DASHBOARD
# =====================================================

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return get_dashboard_stats(
        db,
        current_user.id,
    )

# =====================================================
# DEBUG
# =====================================================

@router.get("/debug/analyses")
def debug_analyses(
    db: Session = Depends(get_db),
):

    analyses = (
        db.query(Analysis)
        .order_by(
            Analysis.created_at.desc()
        )
        .all()
    )

    return [

        {
            "id": analysis.id,
            "user_id": analysis.user_id,
            "image_name": analysis.image_name,
            "image_path": analysis.image_path,
            "score": analysis.score,
            "created_at": analysis.created_at,
        }

        for analysis in analyses

    ]