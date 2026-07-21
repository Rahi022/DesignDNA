"use client";

import { useEffect, useState } from "react";
import { getPromptAnalytics } from "../../services/dashboard";
import { PromptAnalytics } from "../../types/dashboard";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<PromptAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPromptAnalytics();
        setPrompts(data);
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
      <h1 className="text-4xl font-bold">Prompt Analytics</h1>
      <p className="text-zinc-400">
        See which logo prompts are most popular across the platform.
      </p>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : prompts.length === 0 ? (
        <p className="text-zinc-500">No prompts yet.</p>
      ) : (
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800">
          {prompts.map((item, index) => (
            <div
              key={item.prompt}
              className="flex justify-between items-center px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <span className="text-zinc-500 w-6">{index + 1}</span>
                <span className="text-zinc-200">{item.prompt}</span>
              </div>
              <span className="text-blue-400 font-semibold">
                {item.count}×
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
