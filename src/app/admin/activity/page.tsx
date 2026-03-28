"use client"

import { useEffect, useState, useCallback } from "react"
import { getAllActivity, getActivitySummary, type Activity, type ActivitySummary } from "@/lib/api/activityLogs"
import { 
  GitCommitHorizontal, 
  Rocket, 
  UserPlus, 
  AlertCircle, 
  SlidersHorizontal,
  Loader2
} from "lucide-react"

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [summary, setSummary] = useState<ActivitySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "jobs" | "users" | "complaints">("all")

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      const [activityData, summaryData] = await Promise.all([
        getAllActivity(filter),
        getActivitySummary()
      ])

      setActivities(activityData || [])
      setSummary(summaryData || null)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 min-h-screen bg-slate-50 dark:bg-[#020617]">

      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-700 to-cyan-500 bg-clip-text text-transparent">Activity</h1>
          <p className="text-slate-500 text-sm">Real-time system activity logs</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border 
        bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 
        hover:bg-slate-50 dark:hover:bg-indigo-500/10 transition">
          <SlidersHorizontal size={16} />
          Customize
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Total" value={summary?.total || 0} />
        <SummaryCard label="Jobs" value={summary?.jobs || 0} />
        <SummaryCard label="Users" value={summary?.users || 0} />
        <SummaryCard label="Complaints" value={summary?.complaints || 0} />
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        {["all","jobs","users","complaints"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-lg text-sm ${
              filter === f
                ? "bg-indigo-500 text-white"
                : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TIMELINE */}
      <div className="space-y-4">

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No activity found
          </div>
        ) : (
          activities.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))
        )}

      </div>
    </div>
  )
}

/* SUMMARY CARD */

function SummaryCard({ label, value }: any) {
  return (
    <div className="p-5 rounded-xl border 
    bg-white dark:bg-[#0f172a] 
    border-slate-200 dark:border-white/10">
      <p className="text-xs text-slate-500">{label}</p>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{value}</h2>
    </div>
  )
}

/* TIMELINE ITEM */

function TimelineItem({ item }: { item: Activity }) {
  const config = getConfig(item.activity_type)

  return (
    <div className="flex gap-4 items-start">

      {/* ICON */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${config.bg}`}>
        {config.icon}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 rounded-xl border 
      bg-white dark:bg-[#0f172a] 
      border-slate-200 dark:border-white/10 
      hover:bg-slate-50 dark:hover:bg-indigo-500/5 transition">

        <div className="flex justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>
            {item.activity_type}
          </span>

          <span className="text-xs text-slate-400">
            {getTimeAgo(item.created_at)}
          </span>
        </div>

        <p className="text-sm mt-2 text-slate-700 dark:text-slate-300">
          {item.description}
        </p>

      </div>
    </div>
  )
}

/* CONFIG */

function getConfig(type: string) {
  if (type === "job_approved") return {
    icon: <GitCommitHorizontal size={16} />,
    bg: "bg-indigo-500",
    badge: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
  }

  if (type === "user_signup") return {
    icon: <UserPlus size={16} />,
    bg: "bg-blue-500",
    badge: "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
  }

  if (type === "report_created") return {
    icon: <AlertCircle size={16} />,
    bg: "bg-red-500",
    badge: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400"
  }

  return {
    icon: <Rocket size={16} />,
    bg: "bg-green-500",
    badge: "bg-green-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400"
  }
}

/* TIME FORMAT */

function getTimeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000

  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}