"use client"

import { useEffect, useState, useCallback } from "react"
import { getAllActivity, getActivitySummary, type Activity, type ActivitySummary } from "@/lib/api/activityLogs"
import { 
  GitCommitHorizontal, 
  Rocket, 
  UserPlus, 
  AlertCircle, 
  Loader2,
  Briefcase,
  Users,
  AlertTriangle,
  BarChart3
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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8 space-y-8 min-h-screen bg-slate-50 dark:bg-[#020617]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-700 to-cyan-500 bg-clip-text text-transparent">
            Activity
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Real-time system activity logs
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <SummaryCard label="Total" value={summary?.total || 0} />
        <SummaryCard label="Jobs" value={summary?.jobs || 0} />
        <SummaryCard label="Users" value={summary?.users || 0} />
        <SummaryCard label="Complaints" value={summary?.complaints || 0} />
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-2">
        {["all","jobs","users","complaints"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm ${
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

  const config: Record<string, any> = {
    Total: {
      icon: <BarChart3 size={18} />,
      bg: "bg-indigo-100 dark:bg-indigo-500/10",
      color: "text-indigo-600 dark:text-indigo-400"
    },
    Jobs: {
      icon: <Briefcase size={18} />,
      bg: "bg-blue-100 dark:bg-blue-500/10",
      color: "text-blue-600 dark:text-blue-400"
    },
    Users: {
      icon: <Users size={18} />,
      bg: "bg-green-100 dark:bg-green-500/10",
      color: "text-green-600 dark:text-green-400"
    },
    Complaints: {
      icon: <AlertTriangle size={18} />,
      bg: "bg-red-100 dark:bg-red-500/10",
      color: "text-red-600 dark:text-red-400"
    }
  }

  const item = config[label] || config.Total

  return (
    <div className="p-3 md:p-4 rounded-xl border 
    bg-white dark:bg-[#0f172a] 
    border-slate-200 dark:border-white/10 
    flex items-center gap-3 md:gap-4">

      {/* ICON */}
      <div className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
        {item.icon}
      </div>

      {/* TEXT */}
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
          {value}
        </h2>
      </div>

    </div>
  )
}

/* TIMELINE ITEM */

function TimelineItem({ item }: { item: Activity }) {
  const config = getConfig(item.activity_type)

  return (
    <div className="flex gap-3 md:gap-4 items-start">

      {/* ICON */}
      <div className={`w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl flex items-center justify-center text-white ${config.bg}`}>
        {config.icon}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-3 md:p-4 rounded-xl border 
      bg-white dark:bg-[#0f172a] 
      border-slate-200 dark:border-white/10 
      hover:bg-slate-50 dark:hover:bg-indigo-500/5 transition">

        <div className="flex flex-col md:flex-row md:justify-between gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${config.badge}`}>
            {item.activity_type}
          </span>

          <span className="text-xs text-slate-400">
            {getTimeAgo(item.created_at)}
          </span>
        </div>

        <p className="text-sm mt-2 text-slate-700 dark:text-slate-300 break-words">
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