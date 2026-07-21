import { MetricCardProps } from "../types/analysis";

export default function MetricCard({
    title,
    value,
    unit = "",
    status,
}: MetricCardProps) {
    const numericValue = value ?? 0;

    const progress = Math.max(
        0,
        Math.min(
        title === "Sharpness"
            ? numericValue / 20
            : numericValue,
        100
        )
    );

    const progressColor = () => {
        if (title === "Edge Density") {
        if (numericValue >= 10) return "bg-green-500";
        if (numericValue >= 5) return "bg-yellow-500";
        return "bg-red-500";
        }

        if (title === "Whitespace") {
        if (numericValue >= 20 && numericValue <= 60)
            return "bg-green-500";
        if (numericValue >= 10 && numericValue <= 75)
            return "bg-yellow-500";
        return "bg-red-500";
        }

        if (numericValue >= 80) return "bg-green-500";
        if (numericValue >= 60) return "bg-blue-500";
        if (numericValue >= 40) return "bg-yellow-500";

        return "bg-red-500";
    };

    return (
        <div className="bg-neutral-950 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition">

        <h3 className="text-xl font-semibold text-white">
            {title}
        </h3>

        <p className="text-4xl font-bold mt-4">
            {value !== null ? value.toFixed(2) : "--"}
            {unit}
        </p>

        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mt-6">

            <div
            className={`h-full rounded-full transition-all duration-700 ${progressColor()}`}
            style={{
                width: `${progress}%`,
            }}
            />

        </div>

        <p className="mt-4 text-gray-400 text-sm">
            {status ?? "No status available"}
        </p>

        </div>
    );
}