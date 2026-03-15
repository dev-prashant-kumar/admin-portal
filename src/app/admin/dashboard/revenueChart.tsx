"use client";

import {
  AreaChart, // Changed from LineChart
  Area,      // Changed from Line
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jul", revenue: 29000 },
  { month: "Aug", revenue: 31000 },
  { month: "Sep", revenue: 34000 },
  { month: "Oct", revenue: 38000 },
  { month: "Nov", revenue: 43000 },
  { month: "Dec", revenue: 46000 },
  { month: "Jan", revenue: 49000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
          Revenue Growth
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly recurring revenue trend
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data}>
          {/* 1. Define the Gradient Fill */}
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />

          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />

          <YAxis
            tickFormatter={(value) => `$${value / 1000}K`}
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />

          <Tooltip
            cursor={{ stroke: '#6366f1', strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            }}
            formatter={(value) => [`$${(value as number).toLocaleString()}`, "Revenue"]}
          />

          {/* 2. The Area Component */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"       // The line color
            strokeWidth={3}        // Thick line for modern look
            fillOpacity={1}
            fill="url(#colorRevenue)" // Link to the gradient ID above
            activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}