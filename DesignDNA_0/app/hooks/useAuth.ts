"use client";

import { useAuth as useAuthContext } from "../context/AuthContext";

/**
 * Custom authentication hook.
 *
 * Usage:
 * const {
 *   user,
 *   loading,
 *   isAuthenticated,
 *   isAdmin,
 *   login,
 *   logout
 * } = useAuth();
 */
export function useAuth() {
  return useAuthContext();
}