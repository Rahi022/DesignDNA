"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "../components/admin/StatCard";
import { getAdminStats, AdminStats } from "../services/admin";

export default function AdminDashboard() {
    const router = useRouter();

    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getAdminStats();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <>
            <h1 className="text-4xl font-bold mb-8">
                Admin Dashboard
            </h1>

            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatCard
                    title="Total Users"
                    value={loading ? "--" : stats?.total_users ?? 0}
                />

                <StatCard
                    title="Design Analyses"
                    value={loading ? "--" : stats?.total_designs ?? 0}
                />

                <StatCard
                    title="AI Logos"
                    value={loading ? "--" : stats?.total_logos ?? 0}
                    color="text-purple-400"
                />

                <StatCard
                    title="Average Score"
                    value={loading ? "--" : stats?.average_score ?? 0}
                    color="text-green-400"
                />

            </div>

            {/* Quick Actions */}

            <div className="mt-10">

                <h2 className="text-2xl font-semibold mb-4">
                    Quick Actions
                </h2>

                <div className="flex flex-wrap gap-4">

                    <button
                        onClick={() => router.push("/admin/users")}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Manage Users
                    </button>

                    <button
                        onClick={() => router.push("/admin/logos")}
                        className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
                    >
                        Manage Logos
                    </button>

                    <button
                        onClick={() => router.push("/admin/analytics")}
                        className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition"
                    >
                        View Analytics
                    </button>

                </div>

            </div>

            {/* Recent Activity */}

            <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

                <h2 className="text-2xl font-semibold mb-6">
                    Recent Activity
                </h2>

                <p className="text-zinc-500">
                    Visit Design Analyses or AI Logos from the sidebar to see
                    full activity history.
                </p>

            </div>
        </>
    );
}
