"use client";

import { useEffect, useState } from "react";

import {
  Search,
  Download,
  Trash2,
  Heart,
  Calendar,
  Sparkles,
  ImageIcon,
  Filter,
} from "lucide-react";

import { API_URL } from "../../utils/config";

import {
  getLogoHistory,
  deleteLogo,
  LogoResponse,
} from "../../services/logo";

export default function LogoHistoryPage() {

  const [logos, setLogos] = useState<LogoResponse[]>([]);

  const [filteredLogos, setFilteredLogos] = useState<LogoResponse[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedStyle, setSelectedStyle] = useState("All");

  const [selectedLogo, setSelectedLogo] =
    useState<LogoResponse | null>(null);

  async function loadHistory() {

    try {

      const data = await getLogoHistory();

      setLogos(data);

      setFilteredLogos(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadHistory();

  }, []);

  useEffect(() => {

    let data = [...logos];

    if (selectedStyle !== "All") {

      data = data.filter(

        (logo) => logo.style === selectedStyle

      );

    }

    if (search.trim()) {

      data = data.filter((logo) =>

        logo.prompt

          .toLowerCase()

          .includes(search.toLowerCase())

      );

    }

    setFilteredLogos(data);

  }, [logos, search, selectedStyle]);

  async function handleDelete(id: number) {

    if (!confirm("Delete this logo?")) return;

    try {

      await deleteLogo(id);

      const updated = logos.filter(

        (logo) => logo.id !== id

      );

      setLogos(updated);

    }

    catch (err) {

      console.error(err);

      alert("Failed to delete logo.");

    }

  }

  const styles = [

    "All",

    ...new Set(

      logos.map((logo) => logo.style)

    ),

  ];

  return (

    <main className="min-h-screen bg-black text-white px-8 py-10">

      {/* ================= HERO ================= */}

        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-br from-blue-900/20 via-neutral-900 to-purple-900/20 p-10 mb-10">

            {/* Background Blur */}

            <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                    {/* Left */}

                    <div>

                        <div className="flex items-center gap-4">

                            <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">

                                <ImageIcon size={34} />

                            </div>

                            <div>

                                <h1 className="text-5xl font-bold">

                                    Logo Gallery

                                </h1>

                                <p className="text-gray-400 mt-2">

                                    Browse, manage and download your AI generated logos.

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Right Statistics */}

                    <div className="grid grid-cols-2 gap-4">

                        <div className="rounded-2xl border border-neutral-800 bg-black/40 backdrop-blur p-5 hover:scale-105 transition">

                            <p className="text-gray-400 text-sm">

                                Total Logos

                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-blue-400">

                                {logos.length}

                            </h2>

                        </div>

                        <div className="rounded-2xl border border-neutral-800 bg-black/40 backdrop-blur p-5 hover:scale-105 transition">

                            <p className="text-gray-400 text-sm">

                                Styles

                            </p>

                            <h2 className="text-3xl font-bold mt-2 text-purple-400">

                                {styles.length - 1}

                            </h2>

                        </div>

                    </div>

                </div>

                {/* Search */}

                <div className="mt-10 grid lg:grid-cols-[1fr_250px] gap-5">

                    <div className="relative">

                        <Search
                            size={20}
                            className="absolute left-5 top-4 text-gray-500"
                        />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search logo by prompt..."
                            className="
                                w-full
                                rounded-2xl
                                bg-neutral-900
                                border
                                border-neutral-800
                                pl-14
                                pr-5
                                py-4
                                outline-none
                                focus:border-blue-500
                                transition
                            "
                        />

                    </div>

                    <div className="relative">

                        <Filter
                            size={18}
                            className="absolute left-4 top-4 text-gray-500"
                        />

                        <select
                            value={selectedStyle}
                            onChange={(e) =>
                                setSelectedStyle(e.target.value)
                            }
                            className="
                                w-full
                                rounded-2xl
                                bg-neutral-900
                                border
                                border-neutral-800
                                pl-12
                                pr-4
                                py-4
                                outline-none
                                focus:border-blue-500
                                appearance-none
                            "
                        >

                            {styles.map((style) => (

                                <option
                                    key={style}
                                    value={style}
                                >

                                    {style}

                                </option>

                            ))}

                        </select>

                    </div>

                </div>

            </div>

        </div>

        {/* Loading */}

        {loading && (

            <div className="text-center py-24 text-gray-400">

                Loading your logos...

            </div>

        )}

        {/* Empty State */}

        {!loading && filteredLogos.length === 0 && (

            <div className="rounded-3xl border-2 border-dashed border-neutral-700 p-20 text-center">

                <Sparkles
                    size={70}
                    className="mx-auto text-blue-500 mb-5"
                />

                <h2 className="text-3xl font-bold">

                    No Logos Found

                </h2>

                <p className="text-gray-400 mt-4">

                    Generate your first AI logo to see it here.

                </p>

            </div>

        )}

        {/* ================= LOGO GRID ================= */}

        {!loading && filteredLogos.length > 0 && (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

            {filteredLogos.map((logo) => (

                <div
                    key={logo.id}
                    onClick={() => setSelectedLogo(logo)}
                    className="
                        group
                        overflow-hidden
                        rounded-3xl
                        bg-neutral-900
                        border
                        border-neutral-800
                        hover:border-blue-500
                        hover:-translate-y-2
                        transition-all
                        duration-300
                        cursor-pointer
                        shadow-xl
                    "
                >

                    {/* IMAGE */}

                    <div className="relative aspect-square bg-gradient-to-br from-neutral-950 to-neutral-900">

                        <img
                            src={`${API_URL}${logo.image_path}`}
                            alt={logo.prompt}
                            className="
                                w-full
                                h-full
                                object-contain
                                p-6
                                group-hover:scale-110
                                transition
                                duration-500
                            "
                        />

                        {/* Style */}

                        <div className="
                            absolute
                            top-4
                            left-4
                            rounded-full
                            bg-blue-600
                            px-3
                            py-1
                            text-xs
                            font-semibold
                        ">

                            {logo.style}

                        </div>

                        {/* Favorite */}

                        <button
                            onClick={(e)=>e.stopPropagation()}
                            className="
                                absolute
                                top-4
                                right-4
                                h-10
                                w-10
                                rounded-full
                                bg-black/70
                                backdrop-blur
                                flex
                                items-center
                                justify-center
                                hover:bg-red-600
                                transition
                            "
                        >

                            <Heart size={18} />

                        </button>

                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                        <h3 className="
                            font-semibold
                            text-white
                            line-clamp-2
                            min-h-[52px]
                        ">

                            {logo.prompt}

                        </h3>

                        <div className="
                            flex
                            items-center
                            justify-between
                            mt-4
                            text-sm
                            text-gray-400
                        ">

                            <div className="flex items-center gap-2">

                                <Calendar size={14}/>

                                {new Date(
                                    logo.created_at
                                ).toLocaleDateString()}

                            </div>

                            <Sparkles
                                size={16}
                                className="text-yellow-400"
                            />

                        </div>

                        {/* Buttons */}

                        <div className="grid grid-cols-2 gap-3 mt-5">

                            <button
                                onClick={async (e) => {

                                    e.stopPropagation();

                                    const response = await fetch(
                                        `${API_URL}${logo.image_path}`
                                    );

                                    const blob = await response.blob();

                                    const url = window.URL.createObjectURL(blob);

                                    const a = document.createElement("a");

                                    a.href = url;

                                    a.download = `logo-${logo.id}.png`;

                                    document.body.appendChild(a);

                                    a.click();

                                    a.remove();

                                    window.URL.revokeObjectURL(url);

                                }}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-blue-600
                                    hover:bg-blue-700
                                    py-3
                                    transition
                                "
                            >
                                <Download size={17}/>
                                Download
                            </button>

                            <button
                                onClick={(e)=>{

                                    e.stopPropagation();

                                    handleDelete(
                                        logo.id
                                    );

                                }}
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-red-600
                                    hover:bg-red-700
                                    py-3
                                    transition
                                "
                            >

                                <Trash2 size={17}/>

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            ))}

        </div>

        )}

    </main>

    );

}