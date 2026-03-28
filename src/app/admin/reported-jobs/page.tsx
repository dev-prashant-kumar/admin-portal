"use client"

import { useEffect, useState } from "react"
import { getReportedJobs, deleteJob, markFakeJob } from "@/lib/api/jobs"

import {
  Search, Trash2, CheckCircle2, X
} from "lucide-react"

type Job = {
  id: number
  title: string | null
  company: string | null
  location: string | null
  category: string | null
  job_type: string | null
  created_at: string
  is_fake?: boolean
}

export default function ReportedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [toast, setToast] = useState<any>(null)

  async function fetchJobs() {
    setLoading(true)
    const data = await getReportedJobs()
    setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const filtered = jobs.filter(j =>
    (j.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (j.company || "").toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete() {
    if (!selectedJob) return
    await deleteJob(selectedJob.id)
    setIsDeleteOpen(false)
    setToast({ message: "Job permanently deleted" })
    fetchJobs()
  }

  async function markVerified(job: Job) {
    await markFakeJob(job.id, false)  // ✅ REMOVE FROM FAKE
    setToast({ message: "Marked as Verified" })
    fetchJobs()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1f] p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-2xl font-bold text-red-500">
            Reported Jobs
          </h1>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-gray-400"/>
            <input
              type="text"
              placeholder="Search reported jobs..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm
    
    bg-white dark:bg-[#111827]
    
    border border-slate-300 dark:border-slate-700
    text-slate-900 dark:text-slate-200
    
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    
    outline-none 
    focus:ring-2 focus:ring-red-500/40 
    focus:border-red-500
    
    transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border rounded-2xl overflow-hidden border border-red-200 dark:border-red-500/20 shadow-xl">
          <table className="w-full text-sm">

            <thead className="bg-red-50 dark:bg-red-500/5">
              <tr>
                <th className="p-4 text-left">Job</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-500">
                        Loading reported jobs...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No reported jobs 🎉
                  </td>
                </tr>
              ) : (
                filtered.map(job => (
                  <tr key={job.id} className="border-t hover:bg-red-50 dark:hover:bg-red-500/5">

                    {/* JOB + AVATAR */}
                    <td className="p-4">
                      <div className="flex gap-3 items-center">

                        <div className="w-10 h-10 rounded-xl 
                          bg-gradient-to-br from-red-500 to-pink-500 
                          flex items-center justify-center text-white font-bold">
                          {(job.company || "J")[0]}
                        </div>

                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {job.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {job.company} • {job.location}
                          </div>
                        </div>

                      </div>
                    </td>

                    <td className="p-4">{job.category}</td>

                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        {job.job_type}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        Fake
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right space-x-2">

                      {/* MARK VERIFIED */}
                      <button
                        onClick={() => markVerified(job)}
                        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
                        title="Mark as Verified"
                      >
                        <CheckCircle2 size={16}/>
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => { setSelectedJob(job); setIsDeleteOpen(true) }}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400"
                      >
                        <Trash2 size={16}/>
                      </button>

                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      {isDeleteOpen && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white dark:bg-[#111827] p-6 rounded-xl w-80">
            <p className="mb-4 text-sm">
              Delete <b>{selectedJob.title}</b> permanently?
            </p>
            <button onClick={handleDelete} className="w-full bg-red-500 text-white py-2 rounded">
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-[#111827] px-4 py-3 rounded-xl shadow flex gap-2 items-center">
          <CheckCircle2 className="text-green-500"/>
          <span className="text-sm">{toast.message}</span>
          <button onClick={()=>setToast(null)}>
            <X size={14}/>
          </button>
        </div>
      )}
    </div>
  )
}