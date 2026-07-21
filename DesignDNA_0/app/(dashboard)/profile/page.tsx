"use client";

import { API_URL } from "../../utils/config";
import Navbar from "../../components/Navbar";
import AuthGuard from "../../guards/AuthGuard";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboard";
import { DashboardResponse } from "../../types/dashboard";
import { getHistory, HistoryItem } from "../../services/history";
import { getLogoHistory, LogoResponse } from "../../services/logo";

export default function ProfilePage() {
    const {
        isAuthenticated,
        user,
        logout,
    } = useAuth();

    const router = useRouter();
        const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [logos, setLogos] = useState<LogoResponse[]>([]);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const data = await getDashboard();

                setDashboard(data);

                const historyData = await getHistory();

                setHistory(historyData);

                const logoData = await getLogoHistory();

                setLogos(logoData);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        if (isAuthenticated) {
            loadDashboard();
        }

    }, [isAuthenticated]);

    return (
        <AuthGuard>
            <Navbar />

            <main className="min-h-screen bg-black text-white px-8 py-10">

                {/* Welcome */}

                <div className="mb-10">

                    <h1 className="text-5xl font-bold">
                        Welcome back,
                    </h1>

                    <p className="text-2xl mt-3 text-gray-300">
                        {user?.name} 👋
                    </p>

                </div>

                {isAuthenticated ? (

                    <div className="space-y-10">

                        {/* Statistics */}

                        <div className="grid md:grid-cols-3 gap-6">

                            <div className="rounded-xl border border-gray-700 bg-neutral-900 p-6">

                                <p className="text-gray-400">
                                    Designs Analyzed
                                </p>

                                <h2 className="text-4xl font-bold mt-2">
                                    {loading ? "--" : dashboard?.designs_analyzed}
                                </h2>

                            </div>

                            <div className="rounded-xl border border-gray-700 bg-neutral-900 p-6 hover:border-blue-500 transition">

                                <p className="text-gray-400">
                                    AI Logos
                                </p>

                                <h2 className="text-4xl font-bold mt-2">
                                    {loading ? "--" : logos.length}
                                </h2>

                            </div>

                            <div className="rounded-xl border border-gray-700 bg-neutral-900 p-6">

                                <p className="text-gray-400">
                                    Average Score
                                </p>

                                <h2 className="text-4xl font-bold mt-2">
                                    {loading ? "--" : dashboard?.average_score}
                                </h2>

                            </div>

                        </div>

                        {/* Quick Actions */}

                        <div>

                            <h2 className="text-2xl font-semibold mb-4">
                                Quick Actions
                            </h2>

                            <div className="flex gap-4">

                                <button
                                    onClick={() => router.push("/upload")}
                                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                                >
                                    Upload Design
                                </button>

                                <button
                                    onClick={() => router.push("/generate-logo")}
                                    className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-neutral-900 transition"
                                >
                                    Generate Logo
                                </button>

                                <button
                                    onClick={() => router.push("/logo-history")}
                                    className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-neutral-900 transition"
                                >
                                    Logo History
                                </button>

                            </div>

                        </div>

                        {/* Recent Analyses */}

                        <div>

                            <h2 className="text-2xl font-semibold mb-6">
                                Recent Analyses
                            </h2>

                        {history.length === 0 ? (

                            <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500">

                                No analyses yet.

                            </div>

                        ) : (

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                                {history.slice(0, 6).map((item) => (

                                    <div
                                        key={item.id}
                                        onClick={() => router.push(`/history/${item.id}`)}
                                        className="bg-neutral-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 cursor-pointer"
                                    >
                                        <img
                                            src={`${API_URL}${item.image_path}`}
                                            alt={item.image_name}
                                            className="w-full h-52 object-cover"
                                        />

                                        <div className="p-4">

                                            <h3 className="font-semibold truncate">

                                                {item.image_name}

                                            </h3>

                                            <p className="text-blue-400 mt-2">

                                                Score: {item.score}

                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                        </div>

                        {/* Recent AI Logos */}

                        <div>

                            <h2 className="text-2xl font-semibold mb-6">

                                Recent AI Logos

                            </h2>

                            {logos.length === 0 ? (

                                <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500">

                                    No logos generated yet.

                                </div>

                            ) : (

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                                    {logos.slice(0, 4).map((logo) => (

                                        <div
                                            key={logo.id}
                                            className="bg-neutral-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition duration-300"
                                        >

                                            <img
                                                src={`${API_URL}${logo.image_path}`}
                                                alt={logo.prompt}
                                                className="w-full h-48 object-cover"
                                            />

                                            <div className="p-4">

                                                <h3 className="font-semibold truncate">

                                                    {logo.prompt}

                                                </h3>

                                                <p className="text-blue-400 mt-2">

                                                    {logo.style}

                                                </p>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                ) : (

                    <div className="rounded-xl border border-red-500 bg-red-500/10 p-6">

                        <h2 className="text-2xl font-bold mb-2">
                            Not Logged In
                        </h2>

                        <p>
                            Please login to access your profile.
                        </p>

                    </div>

                )}

            </main>

        </AuthGuard>
    );
}