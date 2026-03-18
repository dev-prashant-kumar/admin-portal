"use client"

import { useEffect, useState } from "react"
import {
  getActiveJobsCount,
  getPendingJobsCount
} from "@/lib/api/stats"
import { getRejectedJobsCount } from "@/lib/api/jobs"

export default function JobStatusCard() {
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [active, pending, rejected] = await Promise.all([
          getActiveJobsCount(),
          getPendingJobsCount(),
          getRejectedJobsCount()
        ])

        // Ensure we are saving numbers, not response objects
        setStats({ 
          active: Number(active) || 0, 
          pending: Number(pending) || 0, 
          rejected: Number(rejected) || 0 
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const total = stats.active + stats.pending + stats.rejected

  // Calculate percentages for the stacked bar
  const getWidth = (value: number) => (total > 0 ? (value / total) * 100 : 0)

  const activeWidth = getWidth(stats.active)
  const pendingWidth = getWidth(stats.pending)
  const rejectedWidth = getWidth(stats.rejected)

  if (loading) {
    return <div className="h-44 w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Job Status Overview
        </h2>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{total}</p>
          <p className="text-xs text-slate-500 tracking-wider">Total Jobs</p>
        </div>
      </div>

      {/* Multi-Colored Stacked Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8 flex">
        <div
          title="Approved"
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${activeWidth}%` }}
        />
        <div
          title="Pending"
          className="h-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${pendingWidth}%` }}
        />
        <div
          title="Rejected"
          className="h-full bg-red-500 transition-all duration-500"
          style={{ width: `${rejectedWidth}%` }}
        />
      </div>

      {/* Legend / Detailed Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatItem 
          label="Approved" 
          value={stats.active} 
          color="bg-emerald-500" 
          percent={activeWidth} 
        />
        <StatItem 
          label="Pending" 
          value={stats.pending} 
          color="bg-yellow-400" 
          percent={pendingWidth} 
        />
        <StatItem 
          label="Rejected" 
          value={stats.rejected} 
          color="bg-red-500" 
          percent={rejectedWidth} 
        />
      </div>
    </div>
  )
}

// Sub-component for clean legend items
function StatItem({ label, value, color, percent }: { label: string, value: number, color: string, percent: number }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-slate-800 dark:text-white">{value}</span>
        <span className="text-[10px] text-slate-400">{percent.toFixed(0)}%</span>
      </div>
    </div>
  )
}