"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
    {
        title: "Dashboard",
        href: "/admin",
    },
    {
        title: "Users",
        href: "/admin/users",
    },
    {
        title: "Designs",
        href: "/admin/designs",
    },
    {
        title: "AI Logos",
        href: "/admin/logos",
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
    },
    {
        title: "Settings",
        href: "/admin/settings",
    },
];

export default function AdminSidebar() {

    const pathname = usePathname();

    return (

        <aside className="w-64 bg-black border-r border-zinc-800 flex flex-col">

            <div className="px-8 py-7">

                <h1 className="text-3xl font-bold text-blue-500">

                    DesignDNA

                </h1>

                <p className="text-sm text-zinc-500 mt-1">

                    Admin Panel

                </p>

            </div>

            <nav className="flex-1 px-4">

                {menu.map((item) => {

                    const active = pathname === item.href;

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                block
                                rounded-lg
                                px-4
                                py-3
                                mb-2
                                transition
                                ${
                                    active
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-zinc-900 text-zinc-300"
                                }
                            `}
                        >
                            {item.title}
                        </Link>

                    );

                })}

            </nav>

        </aside>

    );

}