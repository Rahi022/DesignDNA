import { InfoCardProps } from "../types/analysis";

export default function InfoCard({
    title,
    value,
}: InfoCardProps) {
    return (
        <div className="bg-neutral-950 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition">

        <p className="text-gray-400 text-sm uppercase tracking-wide">
            {title}
        </p>

        <h3 className="text-3xl font-bold mt-3 text-white">
            {value !== null
            ? value.toLocaleString()
            : "--"}
        </h3>

        </div>
    );
}