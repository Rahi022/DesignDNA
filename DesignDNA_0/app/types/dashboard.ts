// =====================================================
// USER DASHBOARD
// =====================================================

export interface DashboardResponse {

    designs_analyzed: number;

    logos_generated: number;

    average_score: number;

    highest_score: number;

    lowest_score: number;

    favorite_logos: number;

    downloads: number;

    latest_analysis: string | null;

    latest_logo: string | null;

}

// =====================================================
// ADMIN DASHBOARD
// =====================================================

export interface AdminDashboardResponse {

    total_users: number;

    active_users: number;

    new_users: number;

    total_logos: number;

    total_analyses: number;

    average_score: number;

    downloads: number;

    favorite_logos: number;

}

// =====================================================
// PLATFORM ANALYTICS
// =====================================================

export interface PlatformAnalytics {

    users: number;

    analyses: number;

    logos: number;

    active_users: number;

}

// =====================================================
// PROMPT ANALYTICS
// =====================================================

export interface PromptAnalytics {

    prompt: string;

    count: number;

}

// =====================================================
// DASHBOARD CARD
// =====================================================

export interface DashboardCard {

    title: string;

    value: string | number;

    icon?: string;

    color?: string;

}

// =====================================================
// RECENT ACTIVITY
// =====================================================

export interface RecentActivity {

    id: number;

    title: string;

    description: string;

    created_at: string;

    type: "analysis" | "logo";

}