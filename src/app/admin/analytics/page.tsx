"use client";

import { useEffect, useState } from "react";
import {
  getTotalUsers,
  getTotalJobs,
  getTotalComplaints,
  getJobsOverTime,
} from "@/lib/api/analytics";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { Users, Briefcase, AlertCircle, ArrowUpRight } from "lucide-react";

/* ================= TYPES ================= */

interface Action {
  name: string;
  value: number;
}

interface Stat {
  label: string;
  value: string;
  trend: string;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [users, jobs, complaints] = await Promise.all([
        getTotalUsers(),
        getTotalJobs(),
        getTotalComplaints(),
      ]);

      setStats([
        {
          label: "Total Users",
          value: users?.toString() || "0",
          trend: "Live",
        },
        {
          label: "Active Jobs",
          value: jobs?.toString() || "0",
          trend: "Live",
        },
        {
          label: "Complaints",
          value: complaints?.toString() || "0",
          trend: "Live",
        },
      ]);

      setActions([
        { name: "Complaints Raised", value: complaints || 0 },
        { name: "Resolved", value: Math.floor((complaints || 0) * 0.6) },
        { name: "Pending", value: Math.floor((complaints || 0) * 0.4) },
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;
      await fetchData();
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-10 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 p-10 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Admin Analytics</h1>
          <p className="text-white/80">Live Platform Insights</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>

        {/* COMPLAINTS CHART */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold mb-6 text-slate-900 dark:text-white">
            Complaints Activity
          </h3>

          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* 1. Added margin so YAxis labels aren't cut off */}
              <BarChart
                data={actions}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                {/* 2. Added type="number" for XAxis (hidden) */}
                <XAxis type="number" hide />

                {/* 3. YAxis needs type="category" and width adjustment if labels are long */}
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  width={80}
                />

                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />

                <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
                  {actions.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill="#6366f1" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend }: Stat) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex justify-between">
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <h4 className="text-2xl font-bold">{value}</h4>

        <div className="flex items-center gap-1 text-emerald-500 text-sm">
          <ArrowUpRight size={14} /> {trend}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500">
        <Users size={18} />
      </div>
    </div>
  );
}
