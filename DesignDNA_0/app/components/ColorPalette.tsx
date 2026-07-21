import { ColorPaletteProps } from "../types/analysis";

export default function ColorPalette({
    colors,
    harmony,
}: ColorPaletteProps) {
    return (
        <div className="bg-neutral-950 border border-gray-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-8">
            Color Analysis
        </h2>

        <div className="grid lg:grid-cols-2 gap-10">

            {/* Dominant Colors */}

            <div>

            <h3 className="text-lg font-semibold mb-5">
                Dominant Colors
            </h3>

            <div className="flex flex-wrap gap-5">

                {colors.map((color, index) => (

                <div
                    key={index}
                    className="flex flex-col items-center"
                >

                    <div
                    className="
                        w-16
                        h-16
                        rounded-xl
                        border
                        border-gray-700
                        shadow-lg
                    "
                    style={{
                        backgroundColor: color,
                    }}
                    />

                    <p className="mt-3 text-xs text-gray-400">
                    {color}
                    </p>

                </div>

                ))}

            </div>

            </div>

            {/* Harmony */}

            <div>

            <h3 className="text-lg font-semibold mb-5">
                Color Harmony
            </h3>

            <div className="bg-black border border-gray-700 rounded-xl p-6">

                <h4 className="text-3xl font-bold text-green-400">
                {harmony}
                </h4>

                <p className="text-gray-400 mt-4 leading-7">

                This harmony is estimated using the
                dominant colors detected in your design.

                </p>

            </div>

            </div>

        </div>

        </div>
    );
}