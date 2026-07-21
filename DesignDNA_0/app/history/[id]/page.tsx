"use client";

import { API_URL } from "../../utils/config";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { getAnalysis } from "@/app/services/history";
import { useRouter } from "next/navigation";

interface AnalysisDetail {
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
}

export default function HistoryDetail() {

    const router = useRouter();

    const params = useParams();

    const [analysis, setAnalysis] =
        useState<AnalysisDetail | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadAnalysis() {

            try {

            const data = await getAnalysis(Number(params.id));

            console.log(data);

            setAnalysis(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        loadAnalysis();

    }, [params.id]);

    if (loading) {

        return (
            <div className="min-h-screen bg-black text-white flex justify-center items-center">
                Loading...
            </div>
        );

    }

    if (!analysis) {

        return (
            <div className="min-h-screen bg-black text-white flex justify-center items-center">
                Analysis not found.
            </div>
        );

    }

    return (

        <>
            <Navbar />

            <main className="min-h-screen bg-black text-white px-8 py-10">

                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-bold mb-10">
                    Analysis Details
                </h1>

                <div className="grid lg:grid-cols-2 gap-10">

                    {/* IMAGE */}

                    <div>

                        <img
                            src={`${API_URL}${analysis.image_path}`}
                            alt={analysis.image_name}
                            className="w-full max-h-[650px] object-contain rounded-xl border border-gray-700 bg-neutral-900"
                        />

                    </div>

                    {/* DETAILS */}

                    <div className="space-y-6">

                        <div>

                            <h2 className="text-3xl font-bold">
                                {analysis.image_name}
                            </h2>

                            <p className="text-2xl text-blue-400 mt-2">
                                Score : {analysis.score}
                            </p>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div className="bg-neutral-900 p-5 rounded-xl">
                                Brightness
                                <h3 className="text-2xl mt-2">
                                    {analysis.brightness}
                                </h3>
                            </div>

                            <div className="bg-neutral-900 p-5 rounded-xl">
                                Contrast
                                <h3 className="text-2xl mt-2">
                                    {analysis.contrast}
                                </h3>
                            </div>

                            <div className="bg-neutral-900 p-5 rounded-xl">
                                Sharpness
                                <h3 className="text-2xl mt-2">
                                    {analysis.sharpness}
                                </h3>
                            </div>

                            <div className="bg-neutral-900 p-5 rounded-xl">
                                Whitespace
                                <h3 className="text-2xl mt-2">
                                    {analysis.whitespace}
                                </h3>
                            </div>

                        </div>

                        {/* COLORS */}

                        <div>

                            <h2 className="text-xl font-semibold mb-4">
                                Dominant Colors
                            </h2>

                            <div className="flex gap-3">

                                {(analysis.dominant_colors ?? []).map((color) => (

                                    <div
                                        key={color}
                                        className="w-12 h-12 rounded-full border"
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    />

                                ))}

                            </div>

                        </div>

                        {/* FEEDBACK */}

                        <div>

                            <h2 className="text-xl font-semibold mb-4">
                                AI Feedback
                            </h2>

                            <ul className="space-y-2">

                                {(analysis.feedback ?? []).map((item, index) => (

                                    <li key={index}>
                                        ✅ {item}
                                    </li>

                                ))}

                            </ul>

                        </div>

                    </div>

                </div>

            </main>

        </>

    );

}