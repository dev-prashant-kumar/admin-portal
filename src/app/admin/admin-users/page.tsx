"use client";

import { useEffect, useState } from "react";
import {
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getRoles,
} from "@/lib/api/users";
import { Edit2, Trash2, Mail, X, Plus, Loader2 } from "lucide-react";

type Admin = {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  auth_user_id: string | null;
  role: {
    id: string;
    role_name: string;
    description: string;
  } | null;
  new_password?: string;
};

// Reusable Input Style to keep code clean
const inputClass =
  "w-full mt-1 px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-[#020617] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [roles, setRoles] = useState<any[]>([]);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const currentUserRole = "superadmin";

  async function fetchAdmins() {
    setLoading(true);
    const data = await getAdmins();
    setAdmins(data || []);
    setLoading(false);
  }

  useEffect(() => {
    getRoles().then(setRoles);
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Auto-clear toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  async function handleUpdate() {
    if (!selectedAdmin) return;
    try {
      await updateAdmin(selectedAdmin.id, {
        name: selectedAdmin.name,
        email: selectedAdmin.email,
        is_active: selectedAdmin.is_active,
      });

      if (
        currentUserRole === "superadmin" &&
        selectedAdmin.new_password &&
        selectedAdmin.auth_user_id
      ) {
        await fetch("/api/admin/update-password", {
          method: "POST",
          body: JSON.stringify({
            userId: selectedAdmin.auth_user_id,
            password: selectedAdmin.new_password,
          }),
        });
      }

      setToast({ message: "Admin updated successfully" });
      setIsEditOpen(false);
      fetchAdmins();
    } catch {
      setToast({ message: "Update failed", type: "error" });
    }
  }

  async function confirmDelete() {
    if (!selectedAdmin) return;
    try {
      await deleteAdmin(selectedAdmin.id);
      setToast({ message: "Admin deleted" });
      setIsDeleteOpen(false);
      fetchAdmins();
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-[#0a0f1f] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* TOAST NOTIFICATION */}
        {toast && (
          <div className="fixed top-5 right-5 z-[100] px-4 py-3 rounded-xl shadow-2xl bg-white dark:bg-slate-800 border-l-4 border-green-500 animate-in fade-in slide-in-from-top-4">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        )}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4 items-end">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Admin Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage system access and roles for administrative users.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search admins..."
                className={inputClass}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Admin</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Login</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                      <span className="text-slate-500">
                        Fetching administrators...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    No admins found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-inner">
                          {a.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold">{a.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={12} /> {a.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-[10px] rounded-full font-bold uppercase tracking-tight ${
                          a.role?.role_name === "superadmin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                        }`}
                      >
                        {a.role?.role_name || "Guest"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            a.is_active
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                              : "bg-slate-300"
                          }`}
                        />
                        <span className="text-xs">
                          {a.is_active ? "Active" : "Disabled"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-500">
                      {a.last_login
                        ? new Date(a.last_login).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedAdmin(a);
                            setIsEditOpen(true);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:text-indigo-500 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAdmin(a);
                            setIsDeleteOpen(true);
                          }}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS SECTION --- */}

      {/* EDIT MODAL */}
      {isEditOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10">
              <h2 className="font-bold">Edit Administrator</h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-md transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Full Name
                </label>
                <input
                  className={inputClass}
                  value={selectedAdmin.name}
                  onChange={(e) =>
                    setSelectedAdmin({ ...selectedAdmin, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Email
                </label>
                <input
                  className={inputClass}
                  value={selectedAdmin.email}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <span className="text-sm font-medium">Account Active</span>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-indigo-600"
                  checked={selectedAdmin.is_active}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      is_active: e.target.checked,
                    })
                  }
                />
              </div>
              {currentUserRole === "superadmin" && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">
                    Reset Password
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    className={inputClass}
                    onChange={(e) =>
                      setSelectedAdmin({
                        ...selectedAdmin,
                        new_password: e.target.value,
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 flex gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex-1 py-2 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {isDeleteOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#0f172a] p-6 shadow-2xl border border-slate-200 dark:border-white/10 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold">Delete Admin?</h3>
            <p className="text-sm text-slate-500 mt-2">
              This will permanently remove <b>{selectedAdmin.name}</b> and
              revoke all system access. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="flex-1 py-2 text-sm font-medium bg-slate-100 dark:bg-white/5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 text-sm font-bold bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
