import { apiFetch } from "./api";

import {
    DashboardResponse,
    AdminDashboardResponse,
    PlatformAnalytics,
    PromptAnalytics,
} from "../types/dashboard";

// =====================================================
// USER DASHBOARD
// =====================================================

export async function getDashboard(): Promise<DashboardResponse> {

    return apiFetch<DashboardResponse>(
        "/dashboard"
    );

}

// =====================================================
// ADMIN DASHBOARD
// =====================================================

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {

    return apiFetch<AdminDashboardResponse>(
        "/admin/stats"
    );

}

// =====================================================
// PLATFORM ANALYTICS
// =====================================================

export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {

    return apiFetch<PlatformAnalytics>(
        "/admin/analytics"
    );

}

// =====================================================
// PROMPT ANALYTICS
// =====================================================

export async function getPromptAnalytics(): Promise<PromptAnalytics[]> {

    return apiFetch<PromptAnalytics[]>(
        "/admin/analytics/prompts"
    );

}