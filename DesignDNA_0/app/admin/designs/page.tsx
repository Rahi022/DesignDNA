"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";

interface AdminAnalysis {
  id: number;
  user_id: number;
  image_name: string;
  image_path: string;
  score: number;
  created_at: string;
}

export default function AdminDesignsPage() {
  const [analyses, setAnalyses] = useState<AdminAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<AdminAnalysis[]>("/admin/analyses");
        setAnalyses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Design Analyses</h1>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="w-full">
          <thead className="bg-zinc-800">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">User ID</th>
              <th className="p-4 text-left">Score</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-zinc-500">
                  Loading...
                </td>
              </tr>
            ) : analyses.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-zinc-500">
                  No analyses yet.
                </td>
              </tr>
            ) : (
              analyses.map((item) => (
                <tr key={item.id} className="border-t border-zinc-800">
                  <td className="p-4">{item.image_name}</td>
                  <td className="p-4 text-zinc-400">{item.user_id}</td>
                  <td className="p-4 text-blue-400 font-semibold">
                    {item.score}
                  </td>
                  <td className="p-4 text-zinc-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
