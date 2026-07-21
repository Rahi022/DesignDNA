"use client";

import { useAuth } from "@/app/context/AuthContext";

export default function AdminHeader() {

    const { user } = useAuth();

    return (

        <header className="h-20 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-8">

            <div>

                <h2 className="text-2xl font-bold">

                    Dashboard

                </h2>

                <p className="text-zinc-400 text-sm">

                    Welcome back, {user?.name}

                </p>

            </div>

            <div className="flex items-center gap-4">

                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center font-bold">

                    {user?.name?.charAt(0).toUpperCase()}

                </div>

            </div>

        </header>

    );

}