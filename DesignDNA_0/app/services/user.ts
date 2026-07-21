import { apiFetch } from "./api";

/* ===========================
   Types
=========================== */

export type UserRole = "user" | "admin";

export interface User {
  id: number;

  name: string;

  email: string;

  role: UserRole;

  is_active: boolean;

  is_verified?: boolean;

  avatar_url?: string | null;

  google_id?: string | null;

  created_at: string;

  updated_at?: string;

  last_login?: string | null;
}

export interface UpdateProfileData {
  name?: string;

  avatar_url?: string;
}

export interface ChangePasswordData {
  current_password: string;

  new_password: string;
}

export interface UserStats {
  logos_generated: number;

  logos_analyzed: number;

  downloads: number;

  favorites: number;
}

/* ===========================
   Current User
=========================== */

export async function getCurrentUser(): Promise<User> {
  return apiFetch<User>("/auth/me");
}

/* ===========================
   Profile
=========================== */

export async function updateProfile(
  data: UpdateProfileData
): Promise<User> {
  return apiFetch<User>("/users/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ===========================
   Password
=========================== */

export async function changePassword(
  data: ChangePasswordData
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/users/change-password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/* ===========================
   Avatar
=========================== */

export async function uploadAvatar(
  formData: FormData
): Promise<User> {
  return apiFetch<User>("/users/avatar", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

/* ===========================
   User Statistics
=========================== */

export async function getUserStats(): Promise<UserStats> {
  return apiFetch<UserStats>("/users/stats");
}

/* ===========================
   Delete Account
=========================== */

export async function deleteAccount(): Promise<{
  message: string;
}> {
  return apiFetch("/users/delete", {
    method: "DELETE",
  });
}