"use client";

import { useEffect, useState } from "react";
import { getPlatformAnalytics, getPromptAnalytics } from "../../services/dashboard";
import { PlatformAnalytics, PromptAnalytics } from "../../types/dashboard";

export default function AdminAnalyticsPage() {
  const [platform, setPlatform] = useState<PlatformAnalytics | null>(null);
  const [prompts, setPrompts] = useState<PromptAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [platformData, promptData] = await Promise.all([
          getPlatformAnalytics(),
          getPromptAnalytics(),
        ]);

        setPlatform(platformData);
        setPrompts(promptData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">Platform Analytics</h1>

      {loading ? (
        <p className="text-zinc-500">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
              <p className="text-zinc-400 text-sm">Total Users</p>
              <h2 className="text-3xl font-bold mt-2">{platform?.users ?? "--"}</h2>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
              <p className="text-zinc-400 text-sm">Active Users</p>
              <h2 className="text-3xl font-bold mt-2">
                {platform?.active_users ?? "--"}
              </h2>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
              <p className="text-zinc-400 text-sm">Total Analyses</p>
              <h2 className="text-3xl font-bold mt-2">
                {platform?.analyses ?? "--"}
              </h2>
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
              <p className="text-zinc-400 text-sm">Total Logos</p>
              <h2 className="text-3xl font-bold mt-2">{platform?.logos ?? "--"}</h2>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="text-2xl font-semibold mb-6">Top Logo Prompts</h2>

            {prompts.length === 0 ? (
              <p className="text-zinc-500">No prompts generated yet.</p>
            ) : (
              <div className="space-y-3">
                {prompts.slice(0, 10).map((item) => (
                  <div
                    key={item.prompt}
                    className="flex justify-between items-center border-b border-zinc-800 pb-3"
                  >
                    <span className="text-zinc-300 truncate max-w-md">
                      {item.prompt}
                    </span>
                    <span className="text-blue-400 font-semibold">
                      {item.count}×
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
