"use client";

import { useEffect, useState } from "react";
import { getJobs, deleteJob, markFakeJob } from "@/lib/api/jobs";

import { Search, Trash2, AlertTriangle, CheckCircle2, X } from "lucide-react";

type Job = {
  id: number;
  title: string | null;
  company: string | null;
  location: string | null;
  salary: string | null;
  category: string | null;
  job_type: string | null;
  created_at: string;
  is_fake?: boolean;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState<any>(null);

  async function fetchJobs() {
    setLoading(true);
    const data = await getJobs();
    setJobs(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      (j.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (j.company || "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete() {
    if (!selectedJob) return;
    await deleteJob(selectedJob.id);
    setIsDeleteOpen(false);
    setToast({ message: "Job deleted" });
    fetchJobs();
  }

  async function toggleFake(job: Job) {
    await markFakeJob(job.id, !job.is_fake);
    setToast({ message: job.is_fake ? "Marked real" : "Marked fake" });
    fetchJobs();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1f] p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Jobs Management
          </h1>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-gray-400" />
            <input
              className="pl-8 pr-3 py-2 border rounded-lg text-sm"
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-white/5">
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
                    Loading...
                  </td>
                </tr>
              ) : (
                filtered.map((job) => (
                  <tr
                    key={job.id}
                    className="border-t hover:bg-indigo-50 dark:hover:bg-indigo-500/5"
                  >
                    {/* JOB INFO */}
                    <td className="p-4">
  <div className="flex items-center gap-3">

    {/* AVATAR */}
    <div className="w-10 h-10 rounded-xl 
      bg-gradient-to-br from-indigo-500 to-cyan-500 
      flex items-center justify-center 
      text-white text-xs font-bold shadow-md">
      
      {(job.company || job.title || "J")[0].toUpperCase()}
    </div>

    {/* TEXT */}
    <div>
      <div className="font-semibold text-slate-900 dark:text-white">
        {job.title || "Untitled Job"}
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400">
        {job.company || "Unknown"} • {job.location || "No location"}
      </div>
    </div>

  </div>
</td>

                    <td className="p-4">{job.category}</td>

                    <td className="p-4">
                      <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 rounded">
                        {job.job_type}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      {job.is_fake ? (
                        <span
                          className="text-xs px-2 py-1 rounded-full 
    bg-red-100 text-red-600 
    dark:bg-red-500/10 dark:text-red-400"
                        >
                          Fake
                        </span>
                      ) : (
                        <span
                          className="text-xs px-2 py-1 rounded-full 
    bg-emerald-100 text-emerald-600 
    dark:bg-emerald-500/10 dark:text-emerald-400"
                        >
                          Verified
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right space-x-2">
                      <button
  onClick={() => toggleFake(job)}
  className={`p-2 rounded-lg transition ${
    job.is_fake
      ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400"
  }`}
  title={job.is_fake ? "Mark as Verified" : "Mark as Fake"}
>
  {job.is_fake ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}
</button>

                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-600"
                      >
                        <Trash2 size={16} />
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
              Delete <b>{selectedJob.title}</b>?
            </p>
            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-[#111827] px-4 py-3 rounded-xl shadow flex gap-2 items-center">
          <CheckCircle2 className="text-green-500" />
          <span className="text-sm">{toast.message}</span>
          <button onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
