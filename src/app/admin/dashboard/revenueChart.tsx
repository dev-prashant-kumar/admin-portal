"use client";

import {
  LineChart,
  Line,
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
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Revenue Growth
        </h2>
        <p className="text-sm text-slate-500">
          Monthly recurring revenue trend
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />

          <XAxis dataKey="month" />

          <YAxis
            tickFormatter={(value) => `$${value / 1000}K`}
          />

          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}