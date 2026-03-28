"use client";

import { useEffect, useState } from "react";
import { getAdmins, updateAdmin, deleteAdmin } from "@/lib/api/users";
import { Search, Edit2, Trash2, Mail, X, CheckCircle2 } from "lucide-react";

type Admin = {
  id: string
  name: string
  email: string
  is_active: boolean
  created_at: string
  last_login: string | null
  auth_user_id: string | null

  role: {
    id: string
    role_name: string   // ✅ FIXED
    description: string
  } | null
  new_password?: string
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toast, setToast] = useState<any>(null);

  // 🔐 TEMP: Replace with real auth role
  const currentUserRole = "superadmin";

  async function fetchAdmins() {
    setLoading(true);
    const data = await getAdmins();
    setAdmins(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

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

      // 🔐 Password update (ONLY superadmin)
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

      setToast({ message: "Admin updated" });
      setIsEditOpen(false);
      fetchAdmins();
    } catch {
      setToast({ message: "Update failed" });
    }
  }

  async function confirmDelete() {
    if (!selectedAdmin) return;
    await deleteAdmin(selectedAdmin.id);
    setIsDeleteOpen(false);
    fetchAdmins();
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-[#0a0f1f]">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Admin Users
          </h1>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-gray-400" />
            <input
              className="pl-8 pr-3 py-2 border rounded-lg text-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-white/5">
              <tr>
                <th className="p-4 text-left">Admin</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Last Login</th>
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
                        Loading ...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="p-4">
                      <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 bg-indigo-500 text-white rounded-xl flex items-center justify-center text-xs font-bold">
                          {a.name[0]}
                        </div>
                        <div>
                          <div>{a.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={12} /> {a.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span
                          className={`
      px-2 py-1 text-xs rounded-full font-medium w-fit
      
      ${
        a.role?.role_name === "superadmin"
          ? "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
          : "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
      }
    `}
                        >
                          {a.role?.role_name || "No Role"}
                        </span>

                        {/* description */}
                        <span className="text-[10px] text-slate-500 mt-1">
                          {a.role?.description}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      {a.is_active ? "Active" : "Inactive"}
                    </td>

                    <td className="p-4 text-xs">
                      {a.last_login
                        ? new Date(a.last_login).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedAdmin(a);
                          setIsEditOpen(true);
                        }}
                        className="mr-2 p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-indigo-100 dark:hover:bg-indigo-500/10 text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAdmin(a);
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

      {/* EDIT MODAL */}
      {/* EDIT MODAL */}
{isEditOpen && selectedAdmin && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Edit Admin
        </h2>

        <button
          onClick={() => setIsEditOpen(false)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
        >
          <X size={16} className="text-slate-500" />
        </button>
      </div>

      {/* BODY */}
      <div className="px-6 py-5 space-y-4">

        {/* NAME */}
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Full Name
          </label>
          <input
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm 
            bg-slate-50 dark:bg-[#020617] 
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-white
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
            value={selectedAdmin.name}
            onChange={(e) =>
              setSelectedAdmin({ ...selectedAdmin, name: e.target.value })
            }
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Email Address
          </label>
          <input
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm 
            bg-slate-50 dark:bg-[#020617] 
            border border-slate-300 dark:border-slate-700
            text-slate-900 dark:text-white
            focus:ring-2 focus:ring-indigo-500/40 outline-none"
            value={selectedAdmin.email}
            onChange={(e) =>
              setSelectedAdmin({ ...selectedAdmin, email: e.target.value })
            }
          />
        </div>

        {/* ACTIVE TOGGLE */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Active Status
            </p>
            <p className="text-xs text-slate-500">
              Enable or disable this admin account
            </p>
          </div>

          <input
            type="checkbox"
            checked={selectedAdmin.is_active}
            onChange={(e) =>
              setSelectedAdmin({
                ...selectedAdmin,
                is_active: e.target.checked,
              })
            }
            className="w-4 h-4 accent-indigo-600"
          />
        </div>

        {/* PASSWORD (SUPER ADMIN ONLY) */}
        {currentUserRole === "superadmin" && (
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password..."
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm 
              bg-slate-50 dark:bg-[#020617] 
              border border-slate-300 dark:border-slate-700
              text-slate-900 dark:text-white
              focus:ring-2 focus:ring-indigo-500/40 outline-none"
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

      {/* FOOTER */}
      <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-white/10">

        <button
          onClick={() => setIsEditOpen(false)}
          className="flex-1 py-2 text-sm font-medium rounded-lg 
          bg-slate-100 dark:bg-white/5 
          text-slate-600 dark:text-slate-300 
          hover:bg-slate-200 dark:hover:bg-white/10 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="flex-1 py-2 text-sm font-semibold rounded-lg 
          bg-gradient-to-r from-indigo-500 to-cyan-500 
          text-white shadow-lg hover:opacity-90 transition"
        >
          Save Changes
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}
