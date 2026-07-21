import { UploadHeaderProps } from "../types/analysis";

export default function UploadHeader({
    title,
    subtitle,
}: UploadHeaderProps) {
    return (
        <header className="border-b border-gray-800">

        <div className="max-w-screen-2xl mx-auto px-8 py-8">

            <h1 className="text-5xl font-bold text-white">
            {title}
            </h1>

            <p className="text-gray-400 mt-3 text-lg max-w-3xl">
            {subtitle}
            </p>

        </div>

        </header>
    );
}