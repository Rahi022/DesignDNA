from pathlib import Path

from dotenv import load_dotenv

# Load environment variables (GEMINI_API_KEY, SECRET_KEY, etc.) from .env
# before anything else imports os.getenv(...).
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine
from models import Base

from routers.analyze import router as analyze_router
from routers.auth import router as auth_router
from routers.history import router as history_router
from routers.logo import router as logo_router
from routers.admin import router as admin_router
from routers.users import router as users_router

# =====================================================
# CREATE DATABASE
# =====================================================

Base.metadata.create_all(bind=engine)

# =====================================================
# CREATE REQUIRED DIRECTORIES
# =====================================================

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

LOGO_DIR = UPLOAD_DIR / "logos"
LOGO_DIR.mkdir(exist_ok=True)

ANALYSIS_DIR = UPLOAD_DIR / "analysis"
ANALYSIS_DIR.mkdir(exist_ok=True)

# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title="DesignDNA API",
    version="2.2.0",
    description="Professional AI Logo Generation and Design Analysis Platform",
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# STATIC FILES
# =====================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

# =====================================================
# ROOT
# =====================================================

@app.get("/", tags=["System"])
def root():
    return {
        "name": "DesignDNA API",
        "version": "2.2.0",
        "status": "running",
    }

# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/health", tags=["System"])
def health():
    return {
        "status": "healthy",
        "database": "connected",
    }

# =====================================================
# ROUTERS
# =====================================================

app.include_router(auth_router)
app.include_router(analyze_router)
app.include_router(history_router)
app.include_router(logo_router)
app.include_router(admin_router)
app.include_router(users_router)