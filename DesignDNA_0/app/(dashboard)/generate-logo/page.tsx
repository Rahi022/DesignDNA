"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import {
    generateLogo,
    LogoResponse,
} from "@/app/services/logo";
import { API_URL } from "@/app/utils/config";
import {
    Sparkles,
    Box,
    Gem,
    Cpu,
    Gamepad2,
    Cuboid,
    Palette,
    Clock3
} from "lucide-react";


const styles = [
    {
        name: "Modern",
        icon: Sparkles,
    },
    {
        name: "Minimal",
        icon: Box,
    },
    {
        name: "Luxury",
        icon: Gem,
    },
    {
        name: "Retro",
        icon: Clock3,
    },
    {
        name: "Gaming",
        icon: Gamepad2,
    },
    {
        name: "3D",
        icon: Cuboid,
    },
    {
        name: "Tech",
        icon: Cpu,
    },
    {
        name: "Vintage",
        icon: Palette,
    },
];

const colors = [
    "#2563EB",
    "#22C55E",
    "#EF4444",
    "#F59E0B",
    "#A855F7",
    "#EC4899",
    "#FFFFFF",
    "#000000",
];

export default function GenerateLogoPage() {

    // =====================================================
    // STATES
    // =====================================================

    const [prompt, setPrompt] = useState("");

    const [negativePrompt, setNegativePrompt] =
        useState("");

    const [style, setStyle] =
        useState("Modern");

    const [primaryColor, setPrimaryColor] =
        useState("#2563EB");

    const [loading, setLoading] =
        useState(false);

    const [logo, setLogo] =
        useState<LogoResponse | null>(null);

    const downloadImage = async () => {
    if (!logo) return;
    try {
        const response = await fetch(`${API_URL}${logo.image_path}`);

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = `logo-${logo.id}.png`;

        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
    }
    };

    // =====================================================
    // GENERATE
    // =====================================================

    async function handleGenerate() {

        if (!prompt.trim()) {

            alert("Please enter a prompt.");

            return;

        }

        try {

            setLoading(true);

            const result = await generateLogo({

                prompt,

                style,

                negative_prompt: negativePrompt || undefined,

                colors: [primaryColor],

            });

            setLogo(result);

        }

        catch (err) {

            console.error(err);

            alert("Generation failed.");

        }

        finally {

            setLoading(false);

        }

    }

    // =====================================================
    // REGENERATE
    // =====================================================

    async function regenerateLogo() {

        if (!logo) return;

        await handleGenerate();

    }

    // =====================================================
    // UI
    // =====================================================

    return (

        <>

            <main className="min-h-screen bg-black text-white px-8 py-12">

                <div className="mb-12">

                    <h1 className="text-5xl font-bold">

                        AI Logo Generator

                    </h1>

                    <p className="text-gray-400 mt-3 text-lg">

                        Describe your brand and DesignDNA
                        will generate a professional logo.

                    </p>

                </div>

                <div className="grid lg:grid-cols-2 gap-10">

                    {/* ====================================== */}
                    {/* LEFT PANEL */}
                    {/* ====================================== */}

                    <div className="space-y-8">

                        {/* Prompt */}

                        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">

                            <label className="text-xl font-semibold">

                                Logo Prompt

                            </label>

                            <textarea

                                rows={7}

                                value={prompt}

                                onChange={(e) =>
                                    setPrompt(e.target.value)
                                }

                                placeholder="Example:
Modern coffee shop logo with mountain silhouette and minimalist typography."

                                className="w-full mt-4 rounded-xl bg-black border border-neutral-700 p-4 outline-none focus:border-blue-500 resize-none"

                            />

                            <div className="flex justify-between mt-3 text-sm text-gray-500">

                                <span>

                                    Be descriptive for better
                                    results.

                                </span>

                                <span>

                                    {prompt.length}/500

                                </span>

                            </div>

                        </div>

                        {/* Negative Prompt */}

                        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">

                            <label className="text-xl font-semibold">

                                Negative Prompt

                            </label>

                            <textarea

                                rows={4}

                                value={negativePrompt}

                                onChange={(e) =>
                                    setNegativePrompt(
                                        e.target.value
                                    )
                                }

                                placeholder="Avoid gradients, text, shadows, extra objects..."

                                className="w-full mt-4 rounded-xl bg-black border border-neutral-700 p-4 outline-none focus:border-red-500 resize-none"

                            />

                            <p className="text-gray-500 mt-3 text-sm">

                                Tell the AI what should NOT
                                appear in the logo.

                            </p>

                        </div>

                        {/* Style */}

                    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
                    <h2 className="text-xl font-semibold mb-6">
                        Choose Style
                    </h2>

                    <div className="flex flex-wrap gap-3">
                        {styles.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                            key={item.name}
                            onClick={() => setStyle(item.name)}
                            title={item.name}
                            className={`w-20 h-20 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-2
                                ${
                                style === item.name
                                    ? "border-blue-500 bg-blue-600/20"
                                    : "border-neutral-700 hover:border-blue-400 hover:bg-neutral-800"
                                }`}
                            >
                            <Icon size={24} />

                            <span className="text-xs font-medium">
                                {item.name}
                            </span>
                            </button>
                        );
                        })}
                    </div>
                    </div>

                        {/* Primary Color */}

                        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">

                            <h2 className="text-xl font-semibold mb-5">

                                Primary Color

                            </h2>

                            <div className="flex flex-wrap gap-4">

                                {colors.map((color) => (

                                    <button

                                        key={color}

                                        onClick={() =>
                                            setPrimaryColor(
                                                color
                                            )
                                        }

                                        style={{
                                            background: color,
                                        }}

                                        className={`w-12 h-12 rounded-full border-4 transition

                                        ${
                                            primaryColor === color

                                                ? "border-white scale-110"

                                                : "border-neutral-700"

                                        }`}

                                    />

                                ))}

                            </div>

                        </div>

                        {/* Generate */}

                        <button

                            onClick={handleGenerate}

                            disabled={loading}

                            className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 transition py-5 text-xl font-bold"

                        >

                            {loading

                                ? "Generating Logo..."

                                : "✨ Generate Logo"}

                        </button>

                    </div>

                    {/* RIGHT PANEL STARTS HERE IN PART 2 */}

                    {/* ====================================== */}
                    {/* RIGHT PANEL */}
                    {/* ====================================== */}

                    <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-8 flex flex-col justify-between min-h-[760px]">

                        {loading ? (

                            <div className="flex flex-col items-center justify-center flex-1">

                                <div className="w-72 h-72 rounded-3xl bg-neutral-800 animate-pulse" />

                                <h2 className="text-2xl font-semibold mt-8">

                                    Generating Logo...

                                </h2>

                                <p className="text-gray-500 mt-3">

                                    AI is creating your design...

                                </p>

                            </div>

                        ) : logo ? (

                            <>

                                <div>

                                    <img

                                        src={`${API_URL}${logo.image_path}`}

                                        alt="Generated Logo"

                                        className="w-full max-w-md mx-auto rounded-3xl shadow-2xl border border-neutral-700"

                                    />

                                    <div className="mt-8 space-y-5">

                                        <div>

                                            <p className="text-gray-500 text-sm">

                                                Prompt

                                            </p>

                                            <h2 className="text-xl font-semibold">

                                                {logo.prompt}

                                            </h2>

                                        </div>

                                        <div className="flex flex-wrap gap-3">

                                            <span className="px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500">

                                                {logo.style}

                                            </span>

                                            <span
                                                className="px-4 py-2 rounded-full border"
                                                style={{
                                                    borderColor: primaryColor,
                                                    color: primaryColor,
                                                }}
                                            >
                                                {primaryColor}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* ACTIONS */}

                                <div className="mt-10 space-y-4">

                                    <div className="grid grid-cols-2 gap-4">

                                        <button
                                            onClick={downloadImage}
                                            className="text-center rounded-xl bg-blue-600 hover:bg-blue-700 transition py-4 font-semibold"
                                        >
                                            Download PNG
                                        </button>

                                        <button

                                            onClick={regenerateLogo}

                                            className="rounded-xl bg-neutral-800 hover:bg-neutral-700 transition py-4 font-semibold"

                                        >

                                            Regenerate

                                        </button>

                                    </div>

                                    <button

                                        onClick={() => location.href = "/logo-history"}

                                        className="w-full rounded-xl border border-neutral-700 hover:border-blue-500 hover:bg-neutral-800 transition py-4"

                                    >

                                        Logo History

                                    </button>

                                </div>

                            </>

                        ) : (

                            <div className="flex flex-col items-center justify-center flex-1 text-center">

                                <div className="w-72 h-72 rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center text-8xl">

                                    🎨

                                </div>

                                <h2 className="text-3xl font-bold mt-10">

                                    Ready to Create

                                </h2>

                                <p className="text-gray-500 mt-4 max-w-sm leading-7">

                                    Describe your logo on the left,
                                    choose a style,
                                    select a primary color,
                                    and click
                                    <span className="text-white font-semibold">
                                        {" "}Generate Logo
                                    </span>.

                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">

                                    <div className="rounded-xl bg-neutral-800 p-5">

                                        <p className="text-gray-500 text-sm">

                                            Selected Style

                                        </p>

                                        <h3 className="text-lg font-bold mt-2">

                                            {style}

                                        </h3>

                                    </div>

                                    <div className="rounded-xl bg-neutral-800 p-5">

                                        <p className="text-gray-500 text-sm">

                                            Primary Color

                                        </p>

                                        <div
                                            className="w-10 h-10 rounded-full mt-3 border"
                                            style={{
                                                background: primaryColor,
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </>

    );

}