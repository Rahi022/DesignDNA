"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    // Hide navbar on dashboard pages
    const dashboardRoutes = [
        "/dashboard",
        "/upload",
        "/generate-logo",
        "/logo-history",
        "/profile",
        "/analytics",
        "/settings",
        "/admin",
    ];

    if (dashboardRoutes.some((route) => pathname.startsWith(route))) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

                {/* Logo */}
                <Link href="/">
                    <h1 className="text-3xl font-bold tracking-wide text-white hover:text-blue-400 transition">
                        DesignDNA
                    </h1>
                </Link>

                {/* Right Side */}
                <div className="flex items-center gap-3">

                    {!isAuthenticated ? (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-neutral-900 transition"
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                        >
                            Dashboard
                        </Link>
                    )}

                </div>

            </div>
        </nav>
    );
}