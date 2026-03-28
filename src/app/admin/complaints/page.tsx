"use client"

import { useEffect, useState } from "react"
import { getComplaints, updateComplaint } from "@/lib/api/complaints"
import { Search, CheckCircle2, Clock, AlertCircle } from "lucide-react"

type Complaint = {
  id: string
  complaint_subject: string | null
  complaint_message: string | null
  status: "open" | "in_progress" | "closed"
  created_at: string
  resolved_at: string | null

  admin?: {
    name: string
  } | null
}

export default function ComplaintsPage() {
  const [data, setData] = useState<Complaint[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    setLoading(true)
    const res = await getComplaints()
    setData(res || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = data.filter(c => {
    const matchSearch =
      (c.complaint_subject || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.complaint_message || "").toLowerCase().includes(search.toLowerCase())

    const matchFilter = filter === "all" || c.status === filter

    return matchSearch && matchFilter
  })

  async function changeStatus(c: Complaint, status: string) {
    await updateComplaint(c.id, {
      status,
      resolved_at: status === "closed" ? new Date().toISOString() : null
    })
    fetchData()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1f] p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8 gap-4 flex-col md:flex-row">
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-700 to-cyan-500 bg-clip-text text-transparent">
            Complaints Management
          </h1>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 size-4 text-gray-400"/>
            <input
              type="text"
              placeholder="Search complaints..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm
    
    bg-white dark:bg-[#111827]
    
    border border-slate-300 dark:border-slate-700
    text-slate-900 dark:text-slate-200
    
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    
    outline-none 
    focus:ring-2 focus:ring-indigo-500/40 
    focus:border-indigo-500
    
    transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-6">
          {["all","open","in_progress","closed"].map(f => (
            <button
              key={f}
              onClick={()=>setFilter(f)}
              className={`px-3 py-1 text-xs rounded-lg ${
                filter === f
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-200 dark:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-slate-100 dark:bg-white/5">
              <tr>
                <th className="p-4 text-left">Subject</th>
                <th className="p-4 text-left">Message</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Handled By</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No complaints found
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="border-t hover:bg-slate-50 dark:hover:bg-white/5">

                    <td className="p-4 font-medium">
                      {c.complaint_subject}
                    </td>

                    <td className="p-4 text-xs text-slate-500 max-w-xs truncate">
                      {c.complaint_message}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="p-4 text-xs">
                      {c.admin?.name || "Unassigned"}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 space-x-2">

                      <button
                        onClick={() => changeStatus(c, "in_progress")}
                        className="p-2 rounded-lg bg-amber-100 text-amber-600 
dark:bg-amber-500/10 dark:text-amber-400"
                        title="Mark In Progress"
                      >
                        <Clock size={14}/>
                      </button>

                      <button
                        onClick={() => changeStatus(c, "closed")}
                        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 
dark:bg-emerald-500/10 dark:text-emerald-400"
                        title="Close"
                      >
                        <CheckCircle2 size={14}/>
                      </button>

                      <button
                        onClick={() => changeStatus(c, "open")}
                        className="p-2 rounded-lg bg-red-100 text-red-600 
dark:bg-red-500/10 dark:text-red-400"
                        title="Reopen"
                      >
                        <AlertCircle size={14}/>
                      </button>

                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    open: `
      bg-red-100 text-red-600 
      dark:bg-red-500/10 dark:text-red-400 dark:border dark:border-red-500/20
    `,
    in_progress: `
      bg-amber-100 text-amber-600 
      dark:bg-amber-500/10 dark:text-amber-400 dark:border dark:border-amber-500/20
    `,
    closed: `
      bg-emerald-100 text-emerald-600 
      dark:bg-emerald-500/10 dark:text-emerald-400 dark:border dark:border-emerald-500/20
    `
  }

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${styles[status]}`}>
      {status.replace("_", " ")}
    </span>
  )
}