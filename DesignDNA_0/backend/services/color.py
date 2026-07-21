import cv2
import numpy as np

from collections import Counter


def rgb_to_hex(color):
    return "#{:02x}{:02x}{:02x}".format(
        int(color[0]),
        int(color[1]),
        int(color[2])
    )


def get_dominant_colors(image, k=5):

    pixels = image.reshape((-1, 3))
    pixels = np.float32(pixels)

    criteria = (
        cv2.TERM_CRITERIA_EPS +
        cv2.TERM_CRITERIA_MAX_ITER,
        100,
        0.2
    )

    _, labels, centers = cv2.kmeans(
        pixels,
        k,
        None,
        criteria,
        10,
        cv2.KMEANS_RANDOM_CENTERS
    )

    counts = Counter(labels.flatten())

    ordered = sorted(
        counts.items(),
        key=lambda x: x[1],
        reverse=True
    )

    palette = []

    for index, _ in ordered:

        color = centers[index]

        palette.append(
            rgb_to_hex(color)
        )

    return palette


def analyze_color_harmony(colors):

    unique = len(set(colors))

    if unique <= 2:
        return (
            "Monochromatic",
            "Very consistent color palette."
        )

    elif unique <= 4:
        return (
            "Balanced",
            "Good balance between colors."
        )

    elif unique <= 6:
        return (
            "Vibrant",
            "Rich color palette."
        )

    return (
        "Complex",
        "Large variety of colors detected."
    )