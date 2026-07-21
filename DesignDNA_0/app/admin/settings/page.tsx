"use client";

import { useAuth } from "../../context/AuthContext";

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-4xl font-bold">Admin Settings</h1>

      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-3">
        <h2 className="text-xl font-semibold">Signed in as</h2>
        <p className="text-zinc-400">{user?.name}</p>
        <p className="text-zinc-500 text-sm">{user?.email}</p>
      </div>

      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-3">
        <h2 className="text-xl font-semibold">Platform</h2>
        <p className="text-zinc-500 text-sm">
          DesignDNA v2.2 — AI logo generation is powered by Gemini
          (gemini-2.5-flash-image) when a GEMINI_API_KEY is configured on the
          backend, with an automatic local fallback otherwise.
        </p>
      </div>
    </div>
  );
}
