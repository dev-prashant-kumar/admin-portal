"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
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

export default function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarMenu = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
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
        { label: "Workers", icon: Users, path: "/admin/workers" },
        { label: "Recruiters", icon: UserCheck, path: "/admin/recruiters" },
        { label: "Admins", icon: Shield, path: "/admin/admins" },
        { label: "Blocked Users", icon: UserX, path: "/admin/blocked-users" },
      ],
    },

    {
      title: "Jobs",
      items: [
        { label: "All Jobs", icon: Briefcase, path: "/admin/jobs" },
        {
          label: "Pending Approvals",
          icon: Clock,
          path: "/admin/jobs/pending",
        },
        {
          label: "Reported Jobs",
          icon: AlertTriangle,
          path: "/admin/jobs/reported",
        },
      ],
    },

    {
      title: "Recruitment",
      items: [
        { label: "Applications", icon: FileText, path: "/admin/applications" },
        { label: "Hired Candidates", icon: UserCheck, path: "/admin/hired" },
        { label: "Rejected Candidates", icon: UserX, path: "/admin/rejected" },
      ],
    },

    {
      title: "Finance",
      items: [
        {
          label: "Transactions",
          icon: CreditCard,
          path: "/admin/transactions",
        },
        { label: "Invoices", icon: Receipt, path: "/admin/invoices" },
        {
          label: "Revenue Analytics",
          icon: TrendingUp,
          path: "/admin/revenue",
        },
      ],
    },

    {
      title: "Support",
      items: [
        {
          label: "Complaints",
          icon: MessageCircleWarning,
          path: "/admin/complaints",
        },
        { label: "Reports", icon: Flag, path: "/admin/reports" },
      ],
    },

    {
      title: "Content",
      items: [
        { label: "CMS", icon: FileEdit, path: "/admin/cms" },
        {
          label: "Announcements",
          icon: Megaphone,
          path: "/admin/announcements",
        },
        { label: "FAQ", icon: HelpCircle, path: "/admin/faq" },
      ],
    },

    {
      title: "System",
      items: [
        {
          label: "System Monitoring",
          icon: Activity,
          path: "/admin/monitoring",
        },
        { label: "Backups", icon: DatabaseBackup, path: "/admin/backups" },
      ],
    },

    {
      title: "Settings",
      items: [
        { label: "Admin Roles", icon: ShieldCheck, path: "/admin/roles" },
        { label: "Security", icon: Lock, path: "/admin/security" },
        { label: "Platform Settings", icon: Settings, path: "/admin/settings" },
      ],
    },
  ];

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
        ${collapsed ? "w-[85px]" : "w-[260px]"}
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
          <div className="w-9 h-9 rounded-lg bg-linear-to-r from-indigo-500 via-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
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
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition
  ${
    active
      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-600 "
      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
  }`}
                  >
                    <Icon size={18} />

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
              src="/admin-avatar.png"
              className="w-10 h-10 rounded-full object-cover"
            />

            {!collapsed && (
              <>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    Prashant Kumar
                  </p>
                  <p className="text-xs text-slate-400">Super Admin</p>
                </div>

                <button
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
