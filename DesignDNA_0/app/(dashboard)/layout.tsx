"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import Link from "next/link";

import {
    Home,
    Upload,
    Sparkles,
    History,
    User,
    Settings,
    BarChart3,
    LogOut,
    ChevronRight,
} from "lucide-react";

import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {

    const router = useRouter();

    const pathname = usePathname();

    const {
        loading,
        isAuthenticated,
        user,
        logout,
    } = useAuth();

    useEffect(() => {

        if (!loading && !isAuthenticated) {

            router.replace("/login");

        }

    }, [
        loading,
        isAuthenticated,
        router,
    ]);

    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                Loading...
            </div>
        );

    }

    function signOut() {

        logout();

        router.replace("/login");

    }

    const links = [

        {
            name: "Dashboard",
            href: "/dashboard",
            icon: Home,
        },

        {
            name: "Upload",
            href: "/upload",
            icon: Upload,
        },

        {
            name: "Generate Logo",
            href: "/generate-logo",
            icon: Sparkles,
        },

        {
            name: "Logo History",
            href: "/logo-history",
            icon: History,
        },

        {
            name: "Profile",
            href: "/profile",
            icon: User,
        },

        {
            name: "Analytics",
            href: "/analytics",
            icon: BarChart3,
        },

        {
            name: "Settings",
            href: "/settings",
            icon: Settings,
        },

    ];

    return (

        <div className="min-h-screen bg-black text-white flex">

            {/* Sidebar */}

            <aside className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col">

                <div className="p-8">

                    <Link
                        href="/dashboard"
                        className="text-3xl font-bold"
                    >
                        DesignDNA
                    </Link>

                    <p className="text-gray-500 text-sm mt-2">
                        AI Design Platform
                    </p>

                </div>

                <nav className="flex-1 px-4">

                    {links.map((item) => {

                        const Icon = item.icon;

                        const active =
                            pathname === item.href;

                        return (

                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-2 transition ${
                                    active
                                        ? "bg-blue-600"
                                        : "hover:bg-zinc-900"
                                }`}
                            >

                                <Icon size={20} />

                                {item.name}

                            </Link>

                        );

                    })}

                    {user?.role === "admin" && (

                        <Link
                            href="/admin"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-red-900 mt-8"
                        >

                            <BarChart3 size={20} />

                            Admin Panel

                        </Link>

                    )}

                </nav>

                <div className="border-t border-zinc-800 p-5">

                    <div className="mb-4">

                        <p className="font-semibold">

                            {user?.name}

                        </p>

                        <p className="text-gray-500 text-sm">

                            {user?.email}

                        </p>

                    </div>

                    <button
                        onClick={signOut}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 hover:bg-red-700 transition"
                    >

                        <LogOut size={18} />

                        Logout

                    </button>

                </div>

            </aside>

            {/* Main */}

            <div className="flex-1 flex flex-col">

                {/* Header */}

                <header className="h-20 border-b border-zinc-800 px-10 flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold">

                            {pathname
                                .split("/")
                                .filter(Boolean)
                                .join("  >  ")
                                .replaceAll("-", " ")}

                        </h1>

                    </div>

                    <div className="flex items-center gap-2 text-gray-400">

                        <Link href="/dashboard">

                            Dashboard

                        </Link>

                        <ChevronRight size={18} />

                        <span className="capitalize">

                            {pathname
                                .split("/")
                                .pop()
                                ?.replaceAll("-", " ")}

                        </span>

                    </div>

                </header>

                {/* Content */}

                <main className="flex-1 p-10 overflow-y-auto">

                    {children}

                </main>

            </div>

        </div>

    );

}