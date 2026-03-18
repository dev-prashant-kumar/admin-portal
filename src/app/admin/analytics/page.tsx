"use client"

import { useEffect, useState, useCallback } from "react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts"
import { Users, Briefcase, AlertTriangle, TrendingUp } from "lucide-react"

/* ================= TYPES ================= */

type Stats = { users: number; jobs: number; complaints: number }
type JobsData = { month: string; jobs: number }
type UsersData = { month: string; users: number }
type PieData = { name: string; value: number }

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

/* ================= PAGE ================= */

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ users: 0, jobs: 0, complaints: 0 })
  const [jobsData, setJobsData] = useState<JobsData[]>([])
  const [usersData, setUsersData] = useState<UsersData[]>([])
  const [statusData, setStatusData] = useState<PieData[]>([])
  const [categoryData, setCategoryData] = useState<PieData[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [users, jobs, complaints, jobsOT, userG, jobS, cats] = await Promise.all([
        getTotalUsers(),
        getTotalJobs(),
        getTotalComplaints(),
        getJobsOverTime(),
        getUserGrowth(),
        getJobStatusStats(),
        getTopCategories()
      ])

      setStats({ users, jobs, complaints })
      setJobsData(jobsOT)
      setUsersData(userG)
      setStatusData([
        { name: "Approved", value: jobS.approved },
        { name: "Pending", value: jobS.pending },
        { name: "Rejected", value: jobS.rejected }
      ])
      setCategoryData(cats)
    } catch (err) {
      console.error("Analytics error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return <LoadingSkeleton />

  return (
    <div className="p-8 space-y-8 bg-[#f8f9fb] dark:bg-slate-950 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
        <p className="text-slate-500 mt-1">Deep dive into platform growth and job metrics.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.users} icon={<Users className="text-blue-500" />} trend="+12%" />
        <StatCard title="Total Jobs" value={stats.jobs} icon={<Briefcase className="text-indigo-500" />} trend="+5.4%" />
        <StatCard title="Complaints" value={stats.complaints} icon={<AlertTriangle className="text-amber-500" />} trend="-2%" color="text-rose-500" />
      </div>

      {/* TREND CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChartCard title="Job Posting Trend" subtitle="Monthly jobs submitted">
          <AreaChart data={jobsData}>
            <defs>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="User Growth" subtitle="New platform registrations">
          <AreaChart data={usersData}>
             <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
          </AreaChart>
        </ChartCard>
      </div>

      {/* DISTRIBUTION CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ChartCard title="Job Status Distribution" subtitle="Approval vs Rejection ratio">
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5}>
              {statusData.map((_, i) => <Cell key={i} fill={["#22c55e", "#f59e0b", "#ef4444"][i]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Top Job Categories" subtitle="Based on total postings">
          <PieChart>
            <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
              {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  )
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, icon, trend, color }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-800">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">{icon}</div>
        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
          <TrendingUp size={12} /> {trend}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <h2 className={`text-3xl font-bold mt-1 ${color || "text-slate-900 dark:text-white"}`}>{value}</h2>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-pulse">
      <div className="h-10 w-48 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-3 gap-6"><div className="h-32 bg-slate-200 rounded-2xl" /><div className="h-32 bg-slate-200 rounded-2xl" /><div className="h-32 bg-slate-200 rounded-2xl" /></div>
      <div className="grid grid-cols-2 gap-8"><div className="h-80 bg-slate-200 rounded-3xl" /><div className="h-80 bg-slate-200 rounded-3xl" /></div>
    </div>
  )
}