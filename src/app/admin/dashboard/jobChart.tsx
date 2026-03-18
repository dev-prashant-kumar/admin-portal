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
      <div className="h-90 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800" />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Jobs Posted Over Time
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly job posting trend for the current year
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              className="dark:stroke-slate-800"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={15}
            />

            <YAxis
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ stroke: "#6366f1", strokeWidth: 2, strokeDasharray: "5 5" }}
              contentStyle={{
                backgroundColor: "rgba(225,255,255,0.8)", 
                backdropFilter:"blur(12px)",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              }}
              itemStyle={{ color: "#818cf8", fontWeight: "bold" }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
            />

            <Area
              type="monotone"
              dataKey="jobs"
              stroke="#6366f1"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorJobs)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}