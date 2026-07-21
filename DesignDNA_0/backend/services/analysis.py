import cv2
import numpy as np

from fastapi import HTTPException

from services.color import (
    get_dominant_colors,
    analyze_color_harmony,
)


def analyze_image_file(contents: bytes):

    # ============================================
    # IMAGE DECODING
    # ============================================

    np_array = np.frombuffer(
        contents,
        np.uint8
    )

    image = cv2.imdecode(
        np_array,
        cv2.IMREAD_COLOR
    )

    if image is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid image."
        )

    height, width = image.shape[:2]

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    # ============================================
    # BASIC METRICS
    # ============================================

    brightness = float(
        np.mean(gray)
    )

    contrast = float(
        np.std(gray)
    )

    sharpness = float(
        cv2.Laplacian(
            gray,
            cv2.CV_64F
        ).var()
    )

    edges = cv2.Canny(
        gray,
        100,
        200
    )

    edge_density = (
        np.count_nonzero(edges)
        / edges.size
    ) * 100

    white_pixels = np.sum(
        gray > 240
    )

    whitespace = (
        white_pixels
        / gray.size
    ) * 100

    # ============================================
    # COLOR ANALYSIS
    # ============================================

    rgb = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    dominant_colors = get_dominant_colors(
        rgb,
        5
    )

    harmony, harmony_feedback = analyze_color_harmony(
        dominant_colors
    )

        # ============================================
    # DESIGN SCORING
    # ============================================

    score = 100

    # Brightness
    if brightness < 45:
        score -= 12
    elif brightness > 220:
        score -= 12

    # Contrast
    if contrast < 35:
        score -= 12

    # Sharpness
    if sharpness < 120:
        score -= 15

    # Edge Density
    if edge_density < 2:
        score -= 15
    elif edge_density > 25:
        score -= 8

    # Whitespace
    if whitespace > 80:
        score -= 10
    elif whitespace < 3:
        score -= 10

    score = max(0, min(score, 100))

    # ============================================
    # QUALITY LABEL
    # ============================================

    if score >= 90:
        quality = "Excellent"

    elif score >= 75:
        quality = "Good"

    elif score >= 60:
        quality = "Average"

    else:
        quality = "Needs Improvement"

    # ============================================
    # AI FEEDBACK
    # ============================================

    feedback = []

    # Brightness
    if brightness < 45:
        feedback.append(
            "Overall image brightness is very low."
        )

    elif brightness > 220:
        feedback.append(
            "Overall image brightness is very high."
        )

    # Contrast
    if contrast < 35:
        feedback.append(
            "Increase contrast to improve readability."
        )

    # Sharpness
    if sharpness < 120:
        feedback.append(
            "Image appears blurry."
        )

    # Edge Density
    if edge_density < 2:
        feedback.append(
            "Very little visual structure detected."
        )

    elif edge_density > 25:
        feedback.append(
            "Image contains many edges and may look visually busy."
        )

    # Whitespace
    if whitespace > 80:
        feedback.append(
            "Large amount of empty space detected."
        )

    elif whitespace < 3:
        feedback.append(
            "Layout appears crowded."
        )

    # Color Harmony
    feedback.append(harmony_feedback)

    # Positive Message
    if len(feedback) == 1:
        feedback.append(
            "Overall design metrics look balanced."
        )

    # ============================================
    # METRIC RATINGS
    # ============================================

    metrics = {

        "brightness": (
            "Good"
            if 45 <= brightness <= 220
            else "Poor"
        ),

        "contrast": (
            "Good"
            if contrast >= 35
            else "Poor"
        ),

        "sharpness": (
            "Good"
            if sharpness >= 120
            else "Poor"
        ),

        "edges": (
            "Good"
            if 2 <= edge_density <= 25
            else "Poor"
        ),

        "whitespace": (
            "Balanced"
            if 3 <= whitespace <= 80
            else "Unbalanced"
        )

    }

    # ============================================
    # IMAGE INFORMATION
    # ============================================

    image_info = {

        "width": int(width),

        "height": int(height),

        "pixels": int(width * height)

    }

    # ============================================
    # COLOR INFORMATION
    # ============================================

    color_analysis = {

        "dominant_colors": dominant_colors,

        "palette_size": len(dominant_colors),

        "harmony": harmony

    }


        # ============================================
    # FINAL RESPONSE
    # ============================================

    response = {

        "success": True,

        "version": "V20",

        "image": image_info,

        "analysis": {

            "brightness": round(brightness, 2),

            "contrast": round(contrast, 2),

            "sharpness": round(sharpness, 2),

            "edge_density": round(edge_density, 2),

            "whitespace": round(whitespace, 2)

        },

        "metrics": metrics,

        "colors": color_analysis,

        "result": {

            "score": score,

            "quality": quality

        },

        "feedback": feedback

    }

    return response