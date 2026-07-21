import { API_URL } from "../utils/config";
import { AnalysisResponse } from "../types/analysis";

interface ApiFetchOptions extends RequestInit {
  isFormData?: boolean;
}

/**
 * Core fetch wrapper used by every service file (auth.ts, logo.ts,
 * history.ts, dashboard.ts, admin.ts, user.ts). Keep all request/response
 * handling logic here — do NOT duplicate auth/logo/history calls in this
 * file, they live in their dedicated service modules.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!options.isFormData) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const error = await response.json();

      message = error.detail ?? error.message ?? message;
    } catch {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/* ===========================
   ANALYZE
=========================== */

export async function analyzeImage(
  file: File
): Promise<AnalysisResponse> {
  const formData = new FormData();

  formData.append("file", file);

  return apiFetch<AnalysisResponse>("/analyze", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}
