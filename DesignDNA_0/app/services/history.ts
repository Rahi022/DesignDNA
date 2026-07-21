import { apiFetch } from "./api";

export interface HistoryItem {
  id: number;
  image_name: string;
  image_path: string;
  score: number;
  created_at: string;
}

export interface AnalysisDetail {
  id: number;
  image_name: string;
  image_path: string;
  score: number;
  brightness: number;
  contrast: number;
  sharpness: number;
  edge_density: number;
  whitespace: number;
  dominant_colors: string[];
  color_harmony: string;
  feedback: string[];
  created_at: string;
}

interface HistoryPage {
  page: number;
  limit: number;
  total: number;
  items: HistoryItem[];
}

// The backend returns a paginated object ({ page, limit, total, items }).
// This service unwraps it so consuming components can keep treating the
// result as a plain array, e.g. history.length / history.slice(...).
export async function getHistory(): Promise<HistoryItem[]> {
  const data = await apiFetch<HistoryPage>("/history");
  return data.items;
}

export async function getAnalysis(id: number) {
  return apiFetch<AnalysisDetail>(`/history/${id}`);
}
