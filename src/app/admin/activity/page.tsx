"use client"

import { useEffect, useState, useCallback } from "react"
import { getAllActivity, getActivitySummary, type Activity, type ActivitySummary } from "@/lib/api/activityLogs"
import { 
  GitCommitHorizontal, 
  Rocket, 
  UserPlus, 
  AlertCircle, 
  SlidersHorizontal,
  CircleDot,
  Loader2
} from "lucide-react"

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [summary, setSummary] = useState<ActivitySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  // Declared BEFORE useEffect to fix "accessed before declaration" error
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [activityData, summaryData] = await Promise.all([
        getAllActivity(filter),
        getActivitySummary()
      ])
      setActivities(activityData)
      setSummary(summaryData)
    } catch (error) {
      console.error("Failed to load activity:", error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 bg-[#f8f9fb] min-h-screen dark:bg-slate-950">
      
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Activity</h1>
          <p className="text-slate-500 mt-1">Real-time feed of platform updates and user actions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
          <SlidersHorizontal size={16} />
          Customize Feed
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Today's Activity" value={summary?.todayCount ?? 0} icon={<CircleDot className="text-indigo-500" />} />
        <SummaryCard label="Active Members" value={summary?.activeMembers ?? 0} icon={<UserPlus className="text-blue-500" />} />
        <SummaryCard label="Jobs Pending" value={summary?.pendingJobs ?? 0} icon={<GitCommitHorizontal className="text-orange-500" />} />
        <SummaryCard label="complaints" value={summary?.releases ?? 0} icon={<Rocket className="text-emerald-500" />} />
      </div>

      {/* FILTERS BAR */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-900/50 rounded-xl w-fit">
        {["all", "job", "user", "complaint"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === type
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* TIMELINE SECTION */}
      <div className="space-y-0">
        <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">March 18</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400 uppercase tracking-widest">{activities.length} events</span>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          {!loading && activities.length > 0 && (
            <div className="absolute left-4.75 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800/50" />
          )}

          <div className="space-y-6">
            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="animate-spin mb-2" />
                  <p className="text-sm font-medium tracking-tight">Synchronizing feed...</p>
               </div>
            ) : activities.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
                <p className="text-slate-500">No activity logs found.</p>
              </div>
            ) : (
              activities.map((item) => <TimelineItem key={item.id} item={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</div>
      </div>
    </div>
  )
}

function TimelineItem({ item }: { item: Activity }) {
  const timeAgo = getTimeAgo(item.created_at)
  const badgeClass = getBadgeStyles(item.activity_type)

  return (
    <div className="relative flex items-start group">
      {/* Icon on Line */}
      <div className={`mt-6 z-10 w-10 h-10 rounded-full border-4 border-[#f8f9fb] dark:border-slate-950 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${getIconBg(item.activity_type)}`}>
        {getIcon(item.activity_type)}
      </div>

      {/* Content Card */}
      <div className="flex-1 ml-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {item.user_name?.substring(0, 2).toUpperCase() || "SY"}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{item.user_name || "System"}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                        {item.activity_type?.replace('_', ' ')}
                    </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">{item.description}</h4>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{timeAgo}</span>
        </div>
        
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
          Action performed on production environment. Changes are mirrored across all global nodes.
        </p>

        <div className="mt-4 flex gap-2">
            <span className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
              id-{item.id.substring(0, 8)}
            </span>
        </div>
      </div>
    </div>
  )
}

/* HELPERS */

const ACTIVITY_CONFIG = {
  job: {
    icon: <GitCommitHorizontal size={16} />,
    bg: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20"
  },
  user: {
    icon: <UserPlus size={16} />,
    bg: "bg-green-500",
    badge: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
  },
  complaint: {
    icon: <AlertCircle size={16} />,
    bg: "bg-rose-500",
    badge: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
  },
  approve: {
    icon: <Rocket size={16} />,
    bg: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
  },
  default: {
    icon: <Rocket size={16} />,
    bg: "bg-red-500",
    badge: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
  }
}

// Helper to find the matching config key
function getConfig(type: string) {
  const t = type?.toLowerCase() || "";
  if (t.includes('job') || t.includes('commit')) return ACTIVITY_CONFIG.job;
  if (t.includes('user') || t.includes('signup')) return ACTIVITY_CONFIG.user;
  if (t.includes('complaint') || t.includes('reject')) return ACTIVITY_CONFIG.complaint;
  if (t.includes('approve') || t.includes('deploy')) return ACTIVITY_CONFIG.approve;
  return ACTIVITY_CONFIG.default;
}

function getBadgeStyles(type: string) {
  return getConfig(type).badge;
}

function getIcon(type: string) {
  return getConfig(type).icon;
}

function getIconBg(type: string) {
  return getConfig(type).bg;
}

function getTimeAgo(dateString: string) {
  try {
    const past = new Date(dateString).getTime();
    const now = new Date().getTime();
    
    // Safety check for future dates or invalid strings
    if (isNaN(past)) return "Recently";
    
    const diff = Math.floor((now - past) / 1000);
    
    if (diff < 0) return "Just now"; // Handle slight sync offsets
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "Recently";
  }
}