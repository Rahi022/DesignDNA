"use client";

import { ReactNode } from "react";

interface Props {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: ReactNode;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon,
}: Props) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-blue-500">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-gray-400 text-sm">
                        {title}
                    </p>

                    <h2 className="text-4xl font-bold mt-3">
                        {value}
                    </h2>

                    {subtitle && (

                        <p className="text-gray-500 mt-2 text-sm">
                            {subtitle}
                        </p>

                    )}

                </div>

                {icon && (

                    <div className="text-blue-400">

                        {icon}

                    </div>

                )}

            </div>

        </div>
    );
}