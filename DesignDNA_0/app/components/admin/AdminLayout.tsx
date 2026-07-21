"use client";

import { ReactNode } from "react";
import AdminSidebar from ".//AdminSidebar";
import AdminHeader from ".//AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-zinc-950 text-white">

            <AdminSidebar />

            <div className="flex-1 flex flex-col">

                <AdminHeader />

                <main className="flex-1 p-8 overflow-y-auto">

                    {children}

                </main>

            </div>

        </div>
    );
}