/* =========================================================
DesignDNA V21
Type Definitions
========================================================= */

export interface AnalysisResponse {
    success: boolean;
    version: string;

    image: {
        width: number;
        height: number;
        pixels: number;
    };

    analysis: {
        brightness: number;
        contrast: number;
        sharpness: number;
        edge_density: number;
        whitespace: number;
    };

    metrics: {
        brightness: string;
        contrast: string;
        sharpness: string;
        edges: string;
        whitespace: string;
    };

    colors: {
        dominant_colors: string[];
        palette_size: number;
        harmony: string;
    };

    result: {
        score: number;
        quality: string;
    };

    feedback: string[];
    }

    /* =========================================================
    Component Props
    ========================================================= */

    export interface MetricCardProps {
        title: string;
        value: number | null;
        unit?: string;
        status?: string;
    }

    export interface InfoCardProps {
        title: string;
        value: number | null;
    }

    export interface ScoreCardProps {
        score: number;
    }

    export interface ColorPaletteProps {
        colors: string[];
        harmony: string;
    }

    export interface FeedbackCardProps {
        feedback: string[];
    }

    export interface UploadHeaderProps {
        title: string;
        subtitle: string;
    }