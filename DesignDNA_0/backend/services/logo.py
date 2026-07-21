import os
import io
import shutil
import textwrap
import uuid
from pathlib import Path

from sqlalchemy.orm import Session

from models import LogoGeneration

# =====================================================
# PATHS
# =====================================================

UPLOAD_FOLDER = Path("uploads/logos")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)


def _to_web_path(destination: Path) -> str:
    """
    Convert a local filesystem path (which may use OS-specific
    separators, e.g. backslashes on Windows) into a web-safe,
    forward-slash path with a leading "/" so the frontend can
    safely build `${API_URL}${image_path}` into a valid URL,
    e.g. "/uploads/logos/<uuid>.png"
    """
    return "/" + str(destination).replace("\\", "/")

# =====================================================
# GEMINI CONFIG
# =====================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")

_gemini_client = None


def _get_gemini_client():
    """
    Lazily create (and cache) a Gemini client.
    Returns None if no API key is configured or the SDK isn't installed,
    so the app can gracefully fall back to a placeholder logo.
    """
    global _gemini_client

    if not GEMINI_API_KEY:
        return None

    if _gemini_client is not None:
        return _gemini_client

    try:
        from google import genai

        _gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        return _gemini_client

    except Exception as exc:
        print(f"[logo.py] Could not initialize Gemini client: {exc}")
        return None


def _build_logo_prompt(prompt: str, style: str, negative_prompt: str | None, colors: list[str] | None) -> str:

    parts = [
        "Create a single, professional, print-ready vector-style LOGO ICON "
        "(not a mockup, not a scene, not a photo) for the following brand brief:",
        f'"{prompt.strip()}"',
        f"Design style: {style}.",
        "The logo should be centered, on a clean plain white or transparent background, "
        "with no watermarks, no signatures, and no extra text unless the brand name is explicitly requested.",
    ]

    if colors:
        parts.append(f"Primary brand color(s) to use: {', '.join(colors)}.")

    if negative_prompt and negative_prompt.strip():
        parts.append(f"Avoid the following: {negative_prompt.strip()}.")

    parts.append(
        "The result must look like a polished, modern logo suitable for a real business — "
        "simple, scalable, high contrast, balanced composition."
    )

    return " ".join(parts)


# =====================================================
# GENERATE LOGO WITH GEMINI (with graceful fallback)
# =====================================================

def create_ai_logo(
    prompt: str,
    style: str = "Modern",
    negative_prompt: str | None = None,
    colors: list[str] | None = None,
):
    """
    Attempts to generate a logo image with the Gemini API.
    Falls back to a locally-rendered placeholder if:
      - no GEMINI_API_KEY is configured, or
      - the Gemini SDK isn't installed, or
      - the API call fails for any reason (rate limit, network, etc.)

    Returns a tuple: (relative_image_path: str, used_ai: bool, model_name: str)
    """

    client = _get_gemini_client()

    if client is not None:
        try:
            from google.genai import types

            full_prompt = _build_logo_prompt(prompt, style, negative_prompt, colors)

            response = client.models.generate_content(
                model=GEMINI_IMAGE_MODEL,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE"],
                ),
            )

            for part in response.parts:
                if getattr(part, "inline_data", None):
                    image_bytes = part.inline_data.data

                    filename = f"{uuid.uuid4()}.png"
                    destination = UPLOAD_FOLDER / filename

                    with open(destination, "wb") as f:
                        f.write(image_bytes)

                    return _to_web_path(destination), True, GEMINI_IMAGE_MODEL

            print("[logo.py] Gemini returned no image data, falling back to placeholder.")

        except Exception as exc:
            print(f"[logo.py] Gemini generation failed, falling back to placeholder: {exc}")

    # ---- Fallback: render a simple placeholder locally ----
    return _create_placeholder_logo(prompt, style, colors), False, "placeholder"


# =====================================================
# LOCAL PLACEHOLDER (no external API required)
# =====================================================

def _create_placeholder_logo(prompt: str, style: str = "Modern", colors: list[str] | None = None):
    """
    Renders a simple, deterministic placeholder logo using Pillow so the
    feature always works even without a Gemini API key. Used as a fallback,
    and also useful for local development/testing without burning API quota.
    """

    from PIL import Image, ImageDraw, ImageFont

    size = 800
    background = colors[0] if colors else "#111827"
    accent = colors[1] if colors and len(colors) > 1 else "#3B82F6"

    image = Image.new("RGB", (size, size), background)
    draw = ImageDraw.Draw(image)

    # Simple abstract mark: circle + initial letter
    margin = 120
    draw.ellipse(
        [margin, margin, size - margin, size - margin],
        outline=accent,
        width=18,
    )

    initial = (prompt.strip()[:1] or "D").upper()

    try:
        font = ImageFont.truetype("DejaVuSans-Bold.ttf", 280)
    except Exception:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), initial, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    draw.text(
        ((size - text_w) / 2 - bbox[0], (size - text_h) / 2 - bbox[1]),
        initial,
        fill=accent,
        font=font,
    )

    # Small caption with the style, wrapped, near the bottom
    caption = style.upper()
    try:
        small_font = ImageFont.truetype("DejaVuSans-Bold.ttf", 36)
    except Exception:
        small_font = ImageFont.load_default()

    cap_bbox = draw.textbbox((0, 0), caption, font=small_font)
    cap_w = cap_bbox[2] - cap_bbox[0]

    draw.text(
        ((size - cap_w) / 2, size - 90),
        caption,
        fill="#9CA3AF",
        font=small_font,
    )

    filename = f"{uuid.uuid4()}.png"
    destination = UPLOAD_FOLDER / filename

    image.save(destination, "PNG")

    return _to_web_path(destination)


# Kept for backwards compatibility with any old imports.
def create_placeholder_logo():
    return _create_placeholder_logo("DesignDNA", "Modern")


# =====================================================
# SAVE GENERATED LOGO
# =====================================================

def save_logo(
    db: Session,
    user_id: int,
    prompt: str,
    style: str,
    image_path: str,
):

    logo = LogoGeneration(
        user_id=user_id,
        prompt=prompt,
        style=style,
        image_path=image_path,
    )

    if hasattr(logo, "download_count"):
        logo.download_count = 0

    if hasattr(logo, "is_favorite"):
        logo.is_favorite = False

    if hasattr(logo, "is_deleted"):
        logo.is_deleted = False

    db.add(logo)
    db.commit()
    db.refresh(logo)

    return logo

# =====================================================
# GET USER LOGOS
# =====================================================

def get_user_logos(
    db: Session,
    user_id: int,
):

    query = db.query(LogoGeneration).filter(
        LogoGeneration.user_id == user_id
    )

    if hasattr(LogoGeneration, "is_deleted"):
        query = query.filter(
            LogoGeneration.is_deleted == False
        )

    return (
        query.order_by(
            LogoGeneration.created_at.desc()
        )
        .all()
    )

# =====================================================
# GET SINGLE LOGO
# =====================================================

def get_logo(
    db: Session,
    logo_id: int,
):

    return (
        db.query(LogoGeneration)
        .filter(
            LogoGeneration.id == logo_id
        )
        .first()
    )

# =====================================================
# FAVORITE
# =====================================================

def toggle_favorite(
    db: Session,
    logo: LogoGeneration,
):

    if hasattr(logo, "is_favorite"):
        logo.is_favorite = not logo.is_favorite
        db.commit()
        db.refresh(logo)

    return logo

# =====================================================
# DOWNLOAD
# =====================================================

def increment_download(
    db: Session,
    logo: LogoGeneration,
):

    if hasattr(logo, "download_count"):
        logo.download_count += 1
        db.commit()
        db.refresh(logo)

    return logo

# =====================================================
# DELETE
# =====================================================

def delete_logo(
    db: Session,
    logo: LogoGeneration,
):

    if hasattr(logo, "is_deleted"):
        logo.is_deleted = True
        db.commit()
        db.refresh(logo)
        return

    if os.path.exists(logo.image_path):
        os.remove(logo.image_path)

    db.delete(logo)
    db.commit()

# =====================================================
# ADMIN
# =====================================================

def get_all_logos(
    db: Session,
):

    return (
        db.query(LogoGeneration)
        .order_by(
            LogoGeneration.created_at.desc()
        )
        .all()
    )

# =====================================================
# DASHBOARD
# =====================================================

def total_generated(
    db: Session,
):

    return db.query(
        LogoGeneration
    ).count()
