from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
)

from sqlalchemy.orm import relationship

from database import Base


# =====================================================
# USER MODEL
# =====================================================

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password = Column(
        String,
        nullable=False,
    )

    role = Column(
        String,
        default="user",
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_verified = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    google_id = Column(
        String,
        nullable=True,
        unique=True,
    )

    avatar_url = Column(
        String,
        nullable=True,
    )

    refresh_token = Column(
        String,
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    last_login = Column(
        DateTime,
        nullable=True,
    )

    analyses = relationship(
        "Analysis",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    logos = relationship(
        "LogoGeneration",
        back_populates="user",
        cascade="all, delete-orphan",
    )

# =====================================================
# ANALYSIS MODEL
# =====================================================

class Analysis(Base):

    __tablename__ = "analyses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # Original uploaded filename
    image_name = Column(
        String,
        nullable=False
    )

    # Relative path of stored image
    image_path = Column(
        String,
        nullable=False
    )

    score = Column(
        Integer,
        nullable=False
    )

    brightness = Column(Float)

    contrast = Column(Float)

    sharpness = Column(Float)

    edge_density = Column(Float)

    whitespace = Column(Float)

    dominant_colors = Column(
        String,
        nullable=True
    )

    color_harmony = Column(
        String,
        nullable=True
    )

    feedback = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship(
        "User",
        back_populates="analyses"
    )

    analysis_version = Column(
        String,
        default="1.0",
    )

    processing_time = Column(
        Float,
        nullable=True,
    )

    ai_feedback = Column(
        String,
        nullable=True,
    )


# =====================================================
# LOGO GENERATION MODEL
# =====================================================

class LogoGeneration(Base):

    __tablename__ = "logo_generations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    prompt = Column(
        String,
        nullable=False,
    )

    style = Column(
        String,
        nullable=False,
        default="Modern",
    )

    image_path = Column(
        String,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    user = relationship(
        "User",
        back_populates="logos",
    )

    negative_prompt = Column(
        String,
        nullable=True,
    )

    colors = Column(
        String,
        nullable=True,
    )

    model = Column(
        String,
        default="flux",
    )

    download_count = Column(
        Integer,
        default=0,
    )

    is_favorite = Column(
        Boolean,
        default=False,
    )

    is_deleted = Column(
        Boolean,
        default=False,
    )

    generation_time = Column(
        Float,
        nullable=True,
    )