interface StatCardProps {

    title: string;

    value: number | string;

    color?: string;

}

export default function StatCard({

    title,

    value,

    color = "text-blue-400",

}: StatCardProps) {

    return (

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow">

            <p className="text-zinc-400 text-sm">

                {title}

            </p>

            <h2 className={`text-4xl font-bold mt-3 ${color}`}>

                {value}

            </h2>

        </div>

    );

}