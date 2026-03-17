"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getJobsPostedOverTime } from "@/lib/api/jobs";

type JobChartData = {
  month: string;
  jobs: number;
};

export default function JobsChart() {
  const [data, setData] = useState<JobChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await getJobsPostedOverTime();
      setData(res);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
          Jobs Posted Over Time
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly job posting trend
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            strokeOpacity={0.1}
          />

          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tickFormatter={(value: number) => value.toString()}
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />

          <Tooltip
            cursor={{ stroke: "#6366f1", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`${value}`, "Jobs"]}
          />

          <Area
            type="monotone"
            dataKey="jobs"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorJobs)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
