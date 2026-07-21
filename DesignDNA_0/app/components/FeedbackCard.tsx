import { FeedbackCardProps } from "../types/analysis";

export default function FeedbackCard({
    feedback,
}: FeedbackCardProps) {
    return (
        <div className="bg-neutral-950 border border-gray-800 rounded-2xl p-6">

        <h2 className="text-2xl font-bold mb-6">
            AI Design Feedback
        </h2>

        {feedback.length === 0 ? (

            <div className="text-gray-400">
            No feedback available.
            </div>

        ) : (

            <div className="space-y-4">

            {feedback.map((item, index) => (

                <div
                key={index}
                className="
                    flex
                    items-start
                    gap-4
                    bg-black
                    border
                    border-gray-700
                    rounded-xl
                    p-4
                "
                >

                <div
                    className="
                    flex
                    items-center
                    justify-center
                    w-8
                    h-8
                    rounded-full
                    bg-green-500
                    text-black
                    font-bold
                    shrink-0
                    "
                >
                    ✓
                </div>

                <p className="text-gray-300 leading-7">
                    {item}
                </p>

                </div>

            ))}

            </div>

        )}

        </div>
    );
}