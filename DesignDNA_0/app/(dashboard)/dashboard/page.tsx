"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { getDashboard } from "../../services/dashboard";
import { DashboardResponse } from "../../types/dashboard";

import {
  Image,
  Sparkles,
  Download,
  Trophy,
  TrendingDown,
  Clock3,
  ArrowRight,
} from "lucide-react";

export default function DashboardHomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboard();
        setStats(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const cards = [
    {
      title: "Designs",
      value: stats?.designs_analyzed ?? "--",
      color: "text-blue-400",
      icon: Image,
    },
    {
      title: "AI Logos",
      value: stats?.logos_generated ?? "--",
      color: "text-purple-400",
      icon: Sparkles,
    },
    {
      title: "Average Score",
      value: stats?.average_score ?? "--",
      color: "text-green-400",
      icon: Trophy,
    },
    {
      title: "Downloads",
      value: stats?.downloads ?? "--",
      color: "text-yellow-400",
      icon: Download,
    },
  ];

  return (
    <div className="space-y-10">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="text-gray-400 mt-2">
          Here's your DesignDNA dashboard.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {cards.map((card) => {

          const Icon = card.icon;

          return (

            <div
              key={card.title}
              className="
              rounded-2xl
              bg-neutral-900
              border
              border-neutral-800
              p-6
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-blue-500
              hover:shadow-[0_0_35px_rgba(59,130,246,.2)]
              "
            >

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-400 text-sm">
                    {card.title}
                  </p>

                  <h2
                    className={`text-4xl font-bold mt-3 ${card.color}`}
                  >
                    {loading ? "--" : card.value}
                  </h2>

                </div>

                <div className="rounded-xl bg-neutral-800 p-3">
                  <Icon className="w-7 h-7 text-blue-400" />
                </div>

              </div>

            </div>

          );
        })}
      </div>

      {/* Quick Actions */}

      <div>

        <h2 className="text-2xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          {[
            {
              label: "Upload Design",
              path: "/upload",
            },
            {
              label: "Generate Logo",
              path: "/generate-logo",
            },
            {
              label: "Logo History",
              path: "/logo-history",
            },
          ].map((btn) => (

            <button
              key={btn.label}
              onClick={() => router.push(btn.path)}
              className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-neutral-900
              border
              border-neutral-700
              px-6
              py-3
              transition
              hover:border-blue-500
              hover:bg-blue-600
              hover:text-white
              "
            >

              {btn.label}

              <ArrowRight size={18} />

            </button>

          ))}

        </div>

      </div>

      {/* Highlights */}

      {stats && (

        <>

          <h2 className="text-2xl font-semibold">
            Highlights
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <HighlightCard
              title="Highest Score"
              value={stats.highest_score}
              icon={<Trophy className="text-green-400" />}
              color="from-green-600/20"
            />

            <HighlightCard
              title="Lowest Score"
              value={stats.lowest_score}
              icon={<TrendingDown className="text-red-400" />}
              color="from-red-600/20"
            />

            <HighlightCard
              title="Last Analysis"
              value={
                stats.latest_analysis
                  ? new Date(
                      stats.latest_analysis
                    ).toLocaleDateString()
                  : "—"
              }
              icon={<Clock3 className="text-blue-400" />}
              color="from-blue-600/20"
            />

            <HighlightCard
              title="Average"
              value={stats.average_score}
              icon={<Sparkles className="text-yellow-400" />}
              color="from-yellow-500/20"
            />

          </div>

        </>

      )}

    </div>
  );
}

function HighlightCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`
      rounded-2xl
      border
      border-neutral-800
      bg-gradient-to-br
      ${color}
      to-neutral-900
      p-6
      transition-all
      duration-300
      hover:scale-105
      hover:border-blue-500
      `}
    >

      <div className="flex justify-between items-center mb-5">
        {icon}
      </div>

      <p className="text-gray-400">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}