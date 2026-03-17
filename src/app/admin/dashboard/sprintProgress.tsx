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

  useEffect(() => {

    async function fetchData() {

      const [active, pending, rejected ] = await Promise.all([
        getActiveJobsCount(),
        getPendingJobsCount(),
        getRejectedJobsCount()
      ])
      

      setStats({ active, pending, rejected })
    }

    fetchData()

  }, [])

  const total = stats.active + stats.pending + stats.rejected

  const progress = total
    ? (stats.active / total) * 100
    : 0

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Job Status Overview
        </h2>

        <span className="text-sm text-slate-500">
          Total: {total}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-green-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status */}
      <div className="flex justify-between text-sm">

        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Approved ({stats.active})
        </span>

        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          Pending ({stats.pending})
        </span>

        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          Rejected ({stats.rejected})
        </span>

      </div>

    </div>
  )
}