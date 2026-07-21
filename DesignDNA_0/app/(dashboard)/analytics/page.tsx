"use client";

import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  Sparkles,
  TrendingUp,
  Download,
} from "lucide-react";

import { getDashboard } from "../../services/dashboard";
import { getHistory, HistoryItem } from "../../services/history";
import { getLogoHistory, LogoResponse } from "../../services/logo";
import { DashboardResponse } from "../../types/dashboard";
import { motion } from "framer-motion";

<motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="grid md:grid-cols-4 gap-6"
> </motion.div>

const COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
];

export default function AnalyticsPage() {

  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logos, setLogos] = useState<LogoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function load() {

      try {

        const [dashboardData, historyData, logoData] =
          await Promise.all([
            getDashboard(),
            getHistory(),
            getLogoHistory(),
          ]);

        setStats(dashboardData);
        setHistory(historyData);
        setLogos(logoData);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  const styleBreakdown = logos.reduce<Record<string, number>>(
    (acc, logo) => {

      acc[logo.style] = (acc[logo.style] ?? 0) + 1;

      return acc;

    },
    {}
  );

  const pieData = Object.entries(styleBreakdown).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const scoreData = history.map((item, index) => ({
    day: index + 1,
    score: item.score,
  }));

  return (

    <div className="space-y-8">

        <div>

            <h1 className="text-4xl font-bold">

                Analytics Dashboard

            </h1>

            <p className="text-gray-400">

                Visual insights about your activity.

            </p>

        </div>

        {/* Top Cards */}

        <div className="grid md:grid-cols-4 gap-6">

            <StatCard
                icon={<Activity size={28}/>}
                title="Analyses"
                value={history.length}
                color="text-blue-400"
            />

            <StatCard
                icon={<Sparkles size={28}/>}
                title="AI Logos"
                value={logos.length}
                color="text-purple-400"
            />

            <StatCard
                icon={<TrendingUp size={28}/>}
                title="Average Score"
                value={stats?.average_score ?? "--"}
                color="text-green-400"
            />

            <StatCard
                icon={<Download size={28}/>}
                title="Downloads"
                value={stats?.downloads ?? 0}
                color="text-yellow-400"
            />

        </div>

        {/* Charts */}

        <div className="grid xl:grid-cols-2 gap-8">

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">

                <h2 className="text-xl font-semibold mb-6">

                    Logo Styles

                </h2>

                <ResponsiveContainer width="100%" height={320}>

                    <PieChart>

                        <Pie
                            data={pieData}
                            dataKey="value"
                            outerRadius={110}
                            innerRadius={60}
                            label
                        >

                            {pieData.map((_, index)=>(

                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />

                            ))}

                        </Pie>

                        <Tooltip/>

                    </PieChart>

                </ResponsiveContainer>

            </div>

            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-6">

                <h2 className="text-xl font-semibold mb-6">

                    Score Trend

                </h2>

                <ResponsiveContainer width="100%" height={320}>

                    <AreaChart data={scoreData}>

                        <defs>

                            <linearGradient
                                id="color"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

                                <stop
                                    offset="5%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0.8}
                                />

                                <stop
                                    offset="95%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0}
                                />

                            </linearGradient>

                        </defs>

                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="day"/>

                        <YAxis/>

                        <Tooltip/>

                        <Area
                            type="monotone"
                            dataKey="score"
                            stroke="#3B82F6"
                            fill="url(#color)"
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </div>

        {/* Bottom Cards */}

        <div className="grid md:grid-cols-3 gap-6">

            <HighlightCard
                title="Highest Score"
                value={stats?.highest_score}
                color="text-green-400"
            />

            <HighlightCard
                title="Lowest Score"
                value={stats?.lowest_score}
                color="text-red-400"
            />

            <HighlightCard
                title="Latest Analysis"
                value={
                    stats?.latest_analysis
                        ? new Date(stats.latest_analysis).toLocaleDateString()
                        : "-"
                }
                color="text-blue-400"
            />

        </div>

    </div>

    );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-2xl
      bg-neutral-900
      border
      border-neutral-800
      p-6
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-blue-500
      hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]
    "
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition"/>

      <div className="relative flex justify-between items-center">

        <div>

          <p className="text-gray-400 text-sm">{title}</p>

          <h2 className={`text-4xl font-bold mt-3 ${color}`}>
            {value}
          </h2>

        </div>

        <div className="h-14 w-14 rounded-2xl bg-neutral-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">

          {icon}

        </div>

      </div>

    </div>
  );
}

function HighlightCard({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: string;
}) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-2xl
      bg-neutral-900
      border
      border-neutral-800
      p-8
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-blue-500
      hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]
    "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"/>

      <div className="relative">

        <p className="text-gray-400 text-sm">
          {title}
        </p>

        <h2 className={`text-4xl font-bold mt-4 ${color}`}>
          {value}
        </h2>

      </div>

    </div>
  );
}