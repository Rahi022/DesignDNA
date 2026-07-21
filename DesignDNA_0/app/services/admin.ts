import { apiFetch } from "./api";

export interface AdminStats {
    total_users: number;
    total_designs: number;
    total_logos: number;
    average_score: number;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    analysis_count: number;
    logo_count: number;
    average_score: number;
}

export interface UsersResponse {
    page: number;
    limit: number;
    total: number;
    pages: number;
    users: AdminUser[];
}

// =====================================
// Dashboard
// =====================================

export async function getAdminStats() {
    return apiFetch<AdminStats>("/admin/stats");
}

// =====================================
// Users
// =====================================

export async function getUsers(page = 1, limit = 10, search = "") {
    return apiFetch<UsersResponse>(
        `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
}

// =====================================
// User Details
// =====================================

export async function getUser(id: number) {
    return apiFetch<AdminUser>(`/admin/users/${id}`);
}

// =====================================
// Change Role
// =====================================

export async function updateRole(id: number, role: string) {
    return apiFetch(`/admin/users/${id}/role?role=${role}`, {
        method: "PUT",
    });
}

// =====================================
// Enable / Disable
// =====================================

export async function toggleUser(id: number) {
    return apiFetch(`/admin/users/${id}/status`, {
        method: "PUT",
    });
}

// =====================================
// Delete
// =====================================

export async function deleteUser(id: number) {
    return apiFetch(`/admin/users/${id}`, {
        method: "DELETE",
    });
}