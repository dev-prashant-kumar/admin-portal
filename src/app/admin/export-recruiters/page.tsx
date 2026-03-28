"use client"

import { useState } from "react"
import { getRecruiters } from "@/lib/api/users"
import { Download, FileText } from "lucide-react"

export default function ExportRecruitersPage() {
  const [loading, setLoading] = useState(false)

  function convertToCSV(data: any[]) {
    if (!data.length) return ""

    const headers = Object.keys(data[0])
    const rows = data.map(obj =>
      headers.map(field =>
        `"${(obj[field] ?? "").toString().replace(/"/g, '""')}"`
      ).join(",")
    )

    return [headers.join(","), ...rows].join("\n")
  }

  async function handleExport() {
    try {
      setLoading(true)

      const recruiters = await getRecruiters()

      const csv = convertToCSV(recruiters)

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `recruiters_${new Date().toISOString()}.csv`
      link.click()

      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1f] p-6">
      <div className="max-w-xl mx-auto text-center">

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Export Recruiters
        </h1>

        <div className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl">

          <div className="flex flex-col items-center gap-6">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white">
              <FileText size={28}/>
            </div>

            <p className="text-xs text-slate-500">
              Download all recruiter data
            </p>

            <button
              onClick={handleExport}
              className="flex gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl"
            >
              <Download size={16}/>
              {loading ? "Exporting..." : "Download CSV"}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}