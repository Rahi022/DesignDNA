"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api";
import { LogoResponse, getLogoImageUrl } from "../../services/logo";

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<LogoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<LogoResponse[]>("/admin/logos");
        setLogos(data);
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
      <h1 className="text-4xl font-bold">AI Logos</h1>

      {loading ? (
        <p className="text-zinc-500">Loading logos...</p>
      ) : logos.length === 0 ? (
        <p className="text-zinc-500">No logos generated yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900"
            >
              <img
                src={getLogoImageUrl(logo.image_path)}
                alt={logo.prompt}
                className="w-full h-32 object-cover"
              />
              <div className="p-3">
                <p className="text-xs text-zinc-400 truncate">{logo.prompt}</p>
                <p className="text-xs text-blue-400 mt-1">{logo.style}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
