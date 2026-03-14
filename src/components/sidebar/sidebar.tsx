"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingCart,
  FileText,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronDown,
  Menu
} from "lucide-react"

export default function Sidebar() {

  const pathname = usePathname()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [overviewOpen, setOverviewOpen] = useState(true)
  const [commerceOpen, setCommerceOpen] = useState(false)
  const [appsOpen, setAppsOpen] = useState(false)

  const menuItem =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition cursor-pointer"

  const activeItem =
    "flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-orange-500/10 to-green-500/10 text-blue-600 font-medium border-l-4 border-blue-500"

  return (
    <>
      {/* MOBILE MENU BUTTON */}

      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow p-2 rounded-lg"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* OVERLAY MOBILE */}

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed lg:relative z-50 h-screen bg-white border-r transition-all duration-300 ease-in-out
        ${collapsed ? "w-[85px]" : "w-[260px]"}
        ${mobileOpen ? "left-0" : "-left-full lg:left-0"}
        `}
      >

        {/* COLLAPSE BUTTON */}

        <ChevronLeft
          className={`absolute -right-3 top-24 z-50 flex h-7 w-7 items-center justify-center rounded-full border bg-white shadow cursor-pointer transition-all duration-300
          ${collapsed ? "rotate-180" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
        />

        {/* HEADER */}

        <div className="flex items-center gap-3 px-5 py-4 border-b">

          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 flex items-center justify-center text-white font-bold">
            F
          </div>

          {!collapsed && (
            <div>
              <p className="font-semibold">12thFailJobs</p>
              <p className="text-xs text-gray-400">ADMIN</p>
            </div>
          )}

        </div>

        {/* MENU */}

        <div className="overflow-y-auto h-[calc(100vh-80px)] p-3">

          {/* OVERVIEW */}

          {!collapsed && (
            <p className="text-xs text-gray-400 px-3 mb-2 mt-2">OVERVIEW</p>
          )}

          <div
            className="flex items-center justify-between px-3 py-2 cursor-pointer"
            onClick={() => setOverviewOpen(!overviewOpen)}
          >
            {!collapsed && <span className="text-sm font-medium">Overview</span>}

            {!collapsed && (
              <ChevronDown
                size={16}
                className={`transition ${overviewOpen ? "rotate-180" : ""}`}
              />
            )}
          </div>

          {/* Animated dropdown */}

          <div
            className={`overflow-hidden transition-all duration-300 ${
              overviewOpen ? "max-h-96" : "max-h-0"
            }`}
          >

            <MenuItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              collapsed={collapsed}
              active={pathname === "/admin/dashboard"}
            />

            <MenuItem
              icon={<BarChart3 size={18} />}
              label="Analytics"
              collapsed={collapsed}
              active={pathname === "/admin/analytics"}
            />

            <MenuItem
              icon={<Users size={18} />}
              label="CRM"
              collapsed={collapsed}
              active={pathname === "/admin/crm"}
            />

          </div>

          {/* COMMERCE */}

          {!collapsed && (
            <p className="text-xs text-gray-400 px-3 mt-6 mb-2">COMMERCE</p>
          )}

          <div
            className="flex items-center justify-between px-3 py-2 cursor-pointer"
            onClick={() => setCommerceOpen(!commerceOpen)}
          >

            {!collapsed && <span className="text-sm font-medium">Commerce</span>}

            {!collapsed && (
              <ChevronDown
                size={16}
                className={`transition ${commerceOpen ? "rotate-180" : ""}`}
              />
            )}

          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              commerceOpen ? "max-h-96" : "max-h-0"
            }`}
          >

            <MenuItem
              icon={<ShoppingCart size={18} />}
              label="Orders"
              collapsed={collapsed}
              active={pathname === "/admin/orders"}
              badge="12"
            />

            <MenuItem
              icon={<Users size={18} />}
              label="Customers"
              collapsed={collapsed}
              active={pathname === "/admin/customers"}
            />

            <MenuItem
              icon={<FileText size={18} />}
              label="Invoices"
              collapsed={collapsed}
              active={pathname === "/admin/invoices"}
            />

          </div>

          {/* APPS */}

          {!collapsed && (
            <p className="text-xs text-gray-400 px-3 mt-6 mb-2">APPS</p>
          )}

          <div
            className="flex items-center justify-between px-3 py-2 cursor-pointer"
            onClick={() => setAppsOpen(!appsOpen)}
          >

            {!collapsed && <span className="text-sm font-medium">Apps</span>}

            {!collapsed && (
              <ChevronDown
                size={16}
                className={`transition ${appsOpen ? "rotate-180" : ""}`}
              />
            )}

          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              appsOpen ? "max-h-96" : "max-h-0"
            }`}
          >

            <MenuItem
              icon={<Mail size={18} />}
              label="Mail"
              collapsed={collapsed}
              active={pathname === "/admin/mail"}
            />

            <MenuItem
              icon={<MessageCircle size={18} />}
              label="Chat"
              collapsed={collapsed}
              active={pathname === "/admin/chat"}
            />

          </div>

        </div>

      </aside>
    </>
  )
}

type MenuItemProps = {
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active: boolean
  badge?: string
}

function MenuItem({ icon, label, collapsed, active, badge }: MenuItemProps) {

  return (
    <div className="relative group">

      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition
        ${active
          ? "bg-linear-to-r from-blue-500/10 via-orange-500/10 to-green-500/10 text-blue-600 border-l-4 border-blue-500"
          : "text-gray-600 hover:bg-gray-100"
        }`}
      >

        {icon}

        {!collapsed && <span>{label}</span>}

        {!collapsed && badge && (
          <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}

      </div>

      {/* TOOLTIP */}

      {collapsed && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
          {label}
        </div>
      )}

    </div>
  )
}