"use client"

import { useState } from "react"
import { getWorkers } from "@/lib/api/users"
import { Download, FileText } from "lucide-react"

type FilterType = "all" | "active" | "inactive"

export default function ExportWorkersPage() {
  const [filter, setFilter] = useState<FilterType>("all")
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

  function applyFilter(data: any[]) {
    if (filter === "active") return data.filter(w => w.status === "active")
    if (filter === "inactive") return data.filter(w => w.status === "inactive")
    return data
  }

  async function handleExport() {
    try {
      setLoading(true)

      const workers = await getWorkers()
      const filtered = applyFilter(workers)

      const csv = convertToCSV(filtered)

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `workers_${filter}_${new Date().toISOString()}.csv`
      link.click()

      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0a0f1f] p-4 sm:p-6 flex items-center justify-center">
      
      <div className="w-full max-w-md text-center">
        
        {/* HEADER */}
        <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-700 to-cyan-500 bg-clip-text text-transparent">
          Export Workers Data
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8">
          Download Workers Data with filters
        </p>

        {/* CARD */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-8 shadow-xl">
          
          <div className="flex flex-col items-center gap-5 sm:gap-6">

            {/* ICON */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
              <FileText size={24} />
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex flex-wrap justify-center gap-2 bg-slate-100 dark:bg-white/10 p-1 rounded-xl w-full">
              
              {[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as FilterType)}
                  className={`flex-1 min-w-[80px] px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition ${
                    filter === f.value
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}

            </div>

            {/* INFO */}
            <p className="text-xs sm:text-sm text-slate-500">
              Selected: <b>{filter.toUpperCase()}</b>
            </p>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl 
              bg-gradient-to-r from-indigo-500 to-cyan-500 text-white 
              text-sm sm:text-base font-semibold shadow-lg hover:opacity-90 transition"
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