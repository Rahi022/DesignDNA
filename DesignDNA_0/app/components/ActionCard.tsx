"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface Props {
    href: string;
    title: string;
    description: string;
    icon: ReactNode;
}

export default function ActionCard({
    href,
    title,
    description,
    icon,
}: Props) {

    return (

        <Link
            href={href}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 hover:border-blue-500 transition"
        >

            <div className="mb-6">

                {icon}

            </div>

            <h3 className="text-xl font-bold">

                {title}

            </h3>

            <p className="mt-3 text-gray-400">

                {description}

            </p>

        </Link>

    );

}