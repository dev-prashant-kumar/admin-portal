"use client"

import { useState } from "react"
import { getJobs } from "@/lib/api/jobs"
import { Download, FileText } from "lucide-react"

type FilterType = "all" | "verified" | "fake"

export default function ExportJobsPage() {
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<FilterType>("all")

  // ✅ Convert JSON → CSV
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

  // ✅ Filter logic
  function applyFilter(jobs: any[]) {
    if (filter === "verified") return jobs.filter(j => !j.is_fake)
    if (filter === "fake") return jobs.filter(j => j.is_fake)
    return jobs
  }

  // ✅ Download CSV
  async function handleExport() {
    try {
      setLoading(true)

      const jobs = await getJobs()
      const filteredJobs = applyFilter(jobs)

      const csv = convertToCSV(filteredJobs)

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `jobs_${filter}_${new Date().toISOString()}.csv`
      link.click()

      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert("Export failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1f] p-6">
      <div className="max-w-xl mx-auto text-center">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Export Jobs Data
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Download jobs with filters
        </p>

        {/* CARD */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl">

          <div className="flex flex-col items-center gap-6">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <FileText size={28} />
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex gap-2 bg-slate-100 dark:bg-white/10 p-1 rounded-xl">
              
              {["all", "verified", "fake"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as FilterType)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                    filter === f
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}

            </div>

            {/* INFO */}
            <p className="text-xs text-slate-500">
              Selected: <b>{filter.toUpperCase()}</b> jobs
            </p>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl 
              bg-gradient-to-r from-indigo-500 to-cyan-500 text-white 
              font-semibold shadow-lg hover:opacity-90 transition"
            >
              <Download size={16} />
              {loading ? "Exporting..." : `Download ${filter}`}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}