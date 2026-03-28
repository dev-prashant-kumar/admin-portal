"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  Users,
  UserCheck,
  UserX,
  Shield,
  Briefcase,
  Clock,
  AlertTriangle,
  FileText,
  CreditCard,
  Receipt,
  TrendingUp,
  MessageCircleWarning,
  Flag,
  FileEdit,
  Megaphone,
  HelpCircle,
  Activity,
  Lock,
  Settings,
  ShieldCheck,
  DatabaseBackup,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin } = useAuth();

  const sidebarMenu = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
        { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
        {
          label: "Activity Logs",
          icon: ClipboardList,
          path: "/admin/activity",
        },
      ],
    },

    {
      title: "Users",
      items: [
        { label: "Workers", icon: Users, path: "/admin/worker" },
        { label: "Recruiters", icon: UserCheck, path: "/admin/recruiter" },
        { label: "Admins", icon: Shield, path: "/admin/admin-users" },
        { label: "Blocked Users", icon: UserX, path: "/" },
      ],
    },

    {
      title: "Jobs",
      items: [
        { label: "All Jobs", icon: Briefcase, path: "/" },
        {
          label: "Pending Approvals",
          icon: Clock,
          path: "/",
        },
        {
          label: "Reported Jobs",
          icon: AlertTriangle,
          path: "/",
        },
      ],
    },

    {
      title: "Recruitment",
      items: [
        { label: "Applications", icon: FileText, path: "/" },
        { label: "Hired Candidates", icon: UserCheck, path: "/" },
        { label: "Rejected Candidates", icon: UserX, path: "/" },
      ],
    },

    {
      title: "Finance",
      items: [
        {
          label: "Transactions",
          icon: CreditCard,
          path: "/",
        },
        { label: "Invoices", icon: Receipt, path: "/" },
        {
          label: "Revenue Analytics",
          icon: TrendingUp,
          path: "/",
        },
      ],
    },

    {
      title: "Support",
      items: [
        {
          label: "Complaints",
          icon: MessageCircleWarning,
          path: "/",
        },
        { label: "Reports", icon: Flag, path: "/" },
      ],
    },

    {
      title: "Content",
      items: [
        { label: "CMS", icon: FileEdit, path: "/" },
        {
          label: "Announcements",
          icon: Megaphone,
          path: "s",
        },
        { label: "FAQ", icon: HelpCircle, path: "/" },
      ],
    },

    {
      title: "System",
      items: [
        {
          label: "System Monitoring",
          icon: Activity,
          path: "/",
        },
        { label: "Backups", icon: DatabaseBackup, path: "/" },
      ],
    },

    {
      title: "Settings",
      items: [
        { label: "Admin Roles", icon: ShieldCheck, path: "/" },
        { label: "Security", icon: Lock, path: "/" },
        { label: "Platform Settings", icon: Settings, path: "/" },
      ],
    },
  ];

  async function logout() {
    await supabase.auth.signOut();

    router.push("/admin-login");
  }

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white shadow p-2 rounded-lg"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed lg:relative z-50 h-screen flex flex-col
        bg-white dark:bg-slate-950
        border-r border-slate-200 dark:border-slate-800
        transition-all duration-300
        ${collapsed ? "w-21.25" : "w-65"}
        ${mobileOpen ? "left-0" : "-left-full lg:left-0"}`}
      >
        {/* COLLAPSE BUTTON */}
        <ChevronLeft
          className={`absolute -right-3 top-24 z-50 h-7 w-7 rounded-full border
          bg-white dark:bg-slate-900
          border-slate-200 dark:border-slate-700
          shadow cursor-pointer transition-all duration-300
          ${collapsed ? "rotate-180" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
        />
        {/* HEADER */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-linear-to-r from-blue-600 via-orange-500 to-green-600 flex items-center justify-center text-white font-bold">
            12th
          </div>

          {!collapsed && (
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">
                12thFailjobs
              </p>
              <p className="text-xs text-slate-400">Powered by YugaYatra</p>
            </div>
          )}
        </div>
        {/* MENU */}
        <div className="flex-1 overflow-y-auto sidebar-scroll p-3 pr-2">
          {sidebarMenu.map((section) => (
            <div key={section.title} className="mt-6">
              {!collapsed && (
                <p className="text-xs text-slate-400 px-3 mb-2 tracking-wider">
                  {section.title}
                </p>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;

                return (
    <Link
      key={item.label}
      href={item.path}
      className={`
        group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all
        ${
          active
            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
        }
      `}
    >
      {/* Active Indicator: A simple vertical pill */}
      {active && (
        <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />
      )}
      
      <Icon size={18} className={active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"} />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
              })}
            </div>
          ))}
        </div>
        {/* PROFILE SECTION */}

        <div className="border-t border-slate-200 dark:border-slate-800 p-3">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${admin?.name}`}
              className="w-10 h-10 rounded-full object-cover"
            />

            {!collapsed && admin && (
              <>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {admin.name}
                  </p>

                  <p className="text-xs text-slate-400 capitalize">
                    {admin?.role_name}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="text-xs px-2 py-1 rounded-md
          bg-red-500/10 text-red-500
          hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
