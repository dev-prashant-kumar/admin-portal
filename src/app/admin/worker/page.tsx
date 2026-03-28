"use client";

import { useEffect, useState, cloneElement } from "react";
import { getWorkers, updateWorker, deleteWorker } from "@/lib/api/users";

import {
  Edit2,
  Trash2,
  Mail,
  Phone,
  X,
  CheckCircle2,
} from "lucide-react";

type Worker = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string | null;
  status?: "active" | "inactive" | "pending";
  created_at: string;
};

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  async function fetchWorkers() {
    try {
      setLoading(true);
      const data = await getWorkers();
      setWorkers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredWorkers = workers.filter(
    (w) =>
      (w.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (w.skills || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = async () => {
    if (!selectedWorker) return;

    try {
      await updateWorker(selectedWorker.id, {
        name: selectedWorker.name,
        email: selectedWorker.email,
        phone: selectedWorker.phone,
        skills: selectedWorker.skills,
        status: selectedWorker.status,
      });
      setToast({ message: "Worker updated", type: "success" });
      setIsEditOpen(false);

      fetchWorkers(); // 🔥 reload from DB
    } catch (err) {
      console.error(err);
      setToast({ message: "Update failed", type: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!selectedWorker) return;

    try {
      await deleteWorker(selectedWorker.id);

      setToast({ message: "Worker deleted", type: "success" });
      setIsDeleteOpen(false);

      fetchWorkers(); // 🔥 reload from DB
    } catch (err) {
      console.error(err);
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1f] text-slate-900 dark:text-slate-200 p-4 md:p-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-700 to-cyan-500 bg-clip-text text-transparent">
              Workers Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage workers
            </p>
          </div>
          <div className="relative w-full md:w-72 group">
            {/* Input */}
            <input
              type="text"
              placeholder="Search workers..."
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

        {/* TABLE */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-4 text-left">Worker</th>
                <th className="p-4 text-left">Skills</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-500">
                        Loading workers...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-slate-400">
                    No workers found
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr
                    key={worker.id}
                    className="border-t border-slate-200 dark:border-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition"
                  >
                    <td className="p-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                          {(worker.name || "W")[0]}
                        </div>

                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {worker.name || "Unknown"}
                          </p>

                          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {worker.email || "No email"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {worker.phone || "No phone"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(worker.skills || "No skills")
                          .split(",")
                          .map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-[10px] rounded-full 
          bg-indigo-100 text-indigo-600 
          dark:bg-indigo-500/10 dark:text-indigo-400"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={worker.status} />
                    </td>

                    <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                      {new Date(worker.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedWorker(worker);
                          setIsEditOpen(true);
                        }}
                        className="mr-2 p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWorker(worker);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-100 dark:hover:bg-red-500/10 text-slate-500 dark:text-slate-400 hover:text-red-500 transition"
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

      {/* TOAST */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 
        bg-white dark:bg-[#111827] 
        border border-slate-200 dark:border-white/10 
        px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
        >
          <CheckCircle2 className="text-green-500" />
          <p className="text-xs">{toast.message}</p>
          <button onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md bg-white dark:bg-[#111827] 
    border border-slate-200 dark:border-white/10 
    rounded-2xl shadow-2xl p-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Worker
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-red-500 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm
            bg-slate-100 dark:bg-[#0f172a]
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-200
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  value={selectedWorker.name || ""}
                  onChange={(e) =>
                    setSelectedWorker({
                      ...selectedWorker,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Email
                </label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm
            bg-slate-100 dark:bg-[#0f172a]
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-200
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  value={selectedWorker.email || ""}
                  onChange={(e) =>
                    setSelectedWorker({
                      ...selectedWorker,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Phone Number
                </label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm
            bg-slate-100 dark:bg-[#0f172a]
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-200
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  value={selectedWorker.phone || ""}
                  onChange={(e) =>
                    setSelectedWorker({
                      ...selectedWorker,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              {/* SKILLS */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Skills
                </label>
                <input
                  placeholder="e.g. plumber, electrician"
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm
            bg-slate-100 dark:bg-[#0f172a]
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-200
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  value={selectedWorker.skills || ""}
                  onChange={(e) =>
                    setSelectedWorker({
                      ...selectedWorker,
                      skills: e.target.value,
                    })
                  }
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Status
                </label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm
            bg-slate-100 dark:bg-[#0f172a]
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-200
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  value={selectedWorker.status || "active"}
                  onChange={(e) =>
                    setSelectedWorker({
                      ...selectedWorker,
                      status: e.target.value as any,
                    })
                  }
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex-1 py-2 rounded-lg text-sm border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="flex-1 py-2 rounded-lg text-sm bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteOpen && selectedWorker && (
        <Modal title="Delete Worker" onClose={() => setIsDeleteOpen(false)}>
          <p className="text-sm mb-3">Delete {selectedWorker.name}?</p>
          <button
            onClick={confirmDelete}
            className="w-full py-2 bg-red-500 text-white rounded text-xs font-bold"
          >
            Delete
          </button>
        </Modal>
      )}
    </div>
  );
}

/* COMPONENTS */

function InfoCard({ icon, label, value }: any) {
  return (
    <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-sm">
      <div className="mb-2 text-indigo-500">
        {cloneElement(icon, { size: 16 })}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        {value}
      </h3>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || "active";

  const styles: any = {
    active:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    pending:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
    inactive:
      "bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${styles[s]}`}>{s}</span>
  );
}

function Modal({ children, title, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 p-5 rounded-2xl w-80">
        <h3 className="font-bold mb-3 text-slate-900 dark:text-white">
          {title}
        </h3>
        {children}
        <button
          onClick={onClose}
          className="mt-3 text-xs text-slate-500 dark:text-slate-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}
