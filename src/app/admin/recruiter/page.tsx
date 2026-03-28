"use client";

import { useEffect, useState } from "react";
import {
  getRecruiters,
  updateRecruiter,
  deleteRecruiter,
} from "@/lib/api/users";

import { Search, Edit2, Trash2, Phone, X, CheckCircle2 } from "lucide-react";

type Recruiter = {
  id: number;
  company_name: string | null;
  phone: string | null;
  password?: string;
  created_at: string;
};

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(
    null
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  async function fetchRecruiters() {
    try {
      setLoading(true);
      const data = await getRecruiters();
      setRecruiters(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecruiters();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filtered = recruiters.filter((r) =>
    (r.company_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdate = async () => {
    if (!selectedRecruiter) return;

    try {
      await updateRecruiter(selectedRecruiter.id, {
        company_name: selectedRecruiter.company_name,
        phone: selectedRecruiter.phone,
        ...(selectedRecruiter.password && {
          password: selectedRecruiter.password,
        }),
      });

      setToast({ message: "Recruiter updated", type: "success" });
      setIsEditOpen(false);
      fetchRecruiters();
    } catch (err) {
      console.error(err);
      setToast({ message: "Update failed", type: "error" });
    }
  };

  const confirmDelete = async () => {
    if (!selectedRecruiter) return;

    try {
      await deleteRecruiter(selectedRecruiter.id);

      setToast({ message: "Recruiter deleted", type: "success" });
      setIsDeleteOpen(false);
      fetchRecruiters();
    } catch (err) {
      console.error(err);
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1f] text-slate-900 dark:text-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              Recruiters Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage recruiters
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72 group">
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
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Phone No</th>
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
                        Loading recruiters...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center">
                    No recruiters found
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-slate-200 dark:border-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition"
                  >
                    <td className="p-4 font-medium">
                      <div className="flex gap-3 items-center">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                          {(r.company_name || "W")[0]}
                        </div>

                        {/* Company Info */}
                        <div className="flex flex-col">
                          <span className="text-slate-900 dark:text-white">
                            {r.company_name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Phone size={14} />
                      {r.phone || "No phone"}
                    </td>

                    <td className="p-4 text-xs text-slate-500">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRecruiter(r);
                          setIsEditOpen(true);
                        }}
                        className="mr-2 p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/10"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRecruiter(r);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/10"
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
        <div className="fixed bottom-6 right-6 bg-white dark:bg-[#111827] border px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <CheckCircle2 className="text-green-500" />
          <p className="text-xs">{toast.message}</p>
          <button onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md bg-white dark:bg-[#111827] 
    border border-slate-200 dark:border-white/10 
    rounded-2xl shadow-2xl p-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Recruiter
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
              {/* COMPANY NAME */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Company Name
                </label>
                <input
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm
            bg-slate-100 dark:bg-[#0f172a]
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-200
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  value={selectedRecruiter.company_name || ""}
                  onChange={(e) =>
                    setSelectedRecruiter({
                      ...selectedRecruiter,
                      company_name: e.target.value,
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
                  value={selectedRecruiter.phone || ""}
                  onChange={(e) =>
                    setSelectedRecruiter({
                      ...selectedRecruiter,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              {/* PASSWORD (OPTIONAL) */}
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Password (optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  className="mt-1 w-full px-3 py-2 rounded-lg text-sm
            bg-slate-100 dark:bg-[#0f172a]
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-slate-200
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
                  onChange={(e) =>
                    setSelectedRecruiter({
                      ...selectedRecruiter,
                      password: e.target.value,
                    } as any)
                  }
                />
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
      {isDeleteOpen && selectedRecruiter && (
        <Modal title="Delete Recruiter" onClose={() => setIsDeleteOpen(false)}>
          <p className="text-sm mb-3">
            Delete {selectedRecruiter.company_name}?
          </p>
          <button
            onClick={confirmDelete}
            className="w-full py-2 bg-red-500 text-white rounded text-xs"
          >
            Delete
          </button>
        </Modal>
      )}
    </div>
  );
}

/* MODAL */
function Modal({ children, title, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl w-80">
        <h3 className="font-bold mb-3">{title}</h3>
        {children}
        <button onClick={onClose} className="mt-3 text-xs">
          Close
        </button>
      </div>
    </div>
  );
}
