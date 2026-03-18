"use client"

import { useEffect, useState, useCallback } from "react"
import {
  getTotalUsers,
  getTotalJobs,
  getTotalComplaints,
  getJobsOverTime,
  getUserGrowth,
  getJobStatusStats,
  getTopCategories
} from "@/lib/api/analytics"

import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts"
import { Users, Briefcase, AlertCircle, LucideIcon, RefreshCw } from "lucide-react"

/* ================= TYPES ================= */
interface ChartData {
  month: string;
  jobs: number;
}

interface JobStatus {
  approved: number;
  pending: number;
  rejected: number;
}

/* ================= THEME ================= */
const COLORS = ["#10b981", "#f59e0b", "#ef4444"]; // Green, Amber, Rose

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, jobs: 0, complaints: 0 })
  
  // States for chart data
  const [jobsData, setJobsData] = useState<ChartData[]>([]);
  const [statusData, setStatusData] = useState<{name: string, value: number}[]>([]);
  // Note: usersData and categoryData are fetched but currently unused in your JSX
  const [usersData, setUsersData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [u, j, c, jobsOT, userG, jobS, cats] = await Promise.all([
        getTotalUsers(), 
        getTotalJobs(), 
        getTotalComplaints(),
        getJobsOverTime(), 
        getUserGrowth(), 
        getJobStatusStats(), 
        getTopCategories()
      ])

      setStats({ users: u || 0, jobs: j || 0, complaints: c || 0 })
      setJobsData(jobsOT || [])
      setUsersData(userG || [])
      setCategoryData(cats || [])
      
      setStatusData([
        { name: "Approved", value: jobS?.approved || 0 },
        { name: "Pending", value: jobS?.pending || 0 },
        { name: "Rejected", value: jobS?.rejected || 0 }
      ])
    } catch (err) {
      console.error("Analytics fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { 
    fetchData() 
  }, [fetchData])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Syncing Data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 lg:p-12 text-slate-900 dark:text-slate-100">
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em]">System Insights</span>
          <h1 className="text-3xl font-semibold tracking-tight mt-1">Analytics Dashboard</h1>
        </div>
        <button 
          onClick={fetchData}
          className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 transition-all active:scale-95"
        >
          Refresh Stats
        </button>
      </header>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <StatCard title="Total Users" value={stats.users} icon={Users} trend="+12%" />
        <StatCard title="Active Jobs" value={stats.jobs} icon={Briefcase} trend="+5.4%" />
        <StatCard title="Reports/Issues" value={stats.complaints} icon={AlertCircle} trend="-2%" isWarning />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* GROWTH CHART */}
        <ChartWrapper title="Growth Metrics" description="Monthly job post analysis">
          <AreaChart data={jobsData}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
              dy={10} 
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#6366f1', strokeWidth: 1}} />
            <Area 
              type="monotone" 
              dataKey="jobs" 
              stroke="#6366f1" 
              strokeWidth={3} 
              fill="url(#chartGradient)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ChartWrapper>

        {/* PIE CHART */}
        <ChartWrapper title="Job Health" description="Verification breakdown">
          <div className="flex flex-col sm:flex-row items-center h-full">
            <div className="w-full sm:w-1/2 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={statusData} 
                    innerRadius={60} 
                    outerRadius={85} 
                    paddingAngle={8} 
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-center gap-4 px-6">
              {statusData.map((item, i) => (
                <div key={i} className="flex justify-between items-end border-b border-slate-50 dark:border-slate-800 pb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartWrapper>

      </div>
    </div>
  )
}

/* ================= ATOMS ================= */

function StatCard({ title, value, icon: Icon, trend, isWarning }: { title: string, value: number, icon: LucideIcon, trend: string, isWarning?: boolean }) {
  return (
    <div className="group p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-all hover:border-indigo-100 shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 transition-colors">
          <Icon size={20} />
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isWarning ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
      <p className="text-4xl font-semibold mt-1 tracking-tighter">{value.toLocaleString()}</p>
    </div>
  )
}

function ChartWrapper({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="px-2">
        <h3 className="text-sm font-bold tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      <div className="h-[320px] w-full bg-slate-50/40 dark:bg-slate-900/20 rounded-[2.5rem] p-8 border border-slate-50/50 dark:border-slate-800/50">
        <ResponsiveContainer width="100%" height="100%">{children as React.ReactElement}</ResponsiveContainer>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-2xl text-[11px] font-bold border border-slate-700">
        {payload[0].value} Entries
      </div>
    )
  }
  return null
}