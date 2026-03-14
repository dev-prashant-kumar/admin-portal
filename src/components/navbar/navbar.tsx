"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  Moon,
  Sun,
  Plus,
  Command
} from "lucide-react"

export default function Navbar() {

  const [darkMode, setDarkMode] = useState(false)

  function toggleDark() {
    setDarkMode(!darkMode)

    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (

    <header className="h-[70px] border-b border-slate-200 dark:border-slate-800
    bg-white/70 dark:bg-slate-950/70
    backdrop-blur-xl
    flex items-center justify-between
    px-6">

      {/* LEFT SIDE */}

      <div className="flex items-center gap-4">

        {/* SEARCH */}

        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search anything..."
            className="
            w-[320px]
            pl-10 pr-16 py-2.5
            rounded-xl
            border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900
            text-sm
            outline-none
            focus:ring-2 focus:ring-indigo-500
            "
          />

          {/* CMD K */}

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-slate-400 border px-1.5 py-0.5 rounded">

            <Command size={12} />
            K

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-3">

        {/* NEW BUTTON */}

        <button className="
        hidden md:flex
        items-center gap-2
        px-4 py-2
        rounded-xl
        text-white
        text-sm
        bg-linear-to-r
        from-indigo-500
        via-purple-500
        to-blue-500
        hover:opacity-90
        transition
        ">

          <Plus size={16} />

          New Order

        </button>

        {/* DARK MODE */}

        <button
          onClick={toggleDark}
          className="
          p-2
          rounded-lg
          hover:bg-slate-100
          dark:hover:bg-slate-800
          transition
          "
        >

          {darkMode ? <Sun size={18} /> : <Moon size={18} />}

        </button>

        {/* NOTIFICATIONS */}

        <div className="relative">

          <button className="
          p-2
          rounded-lg
          hover:bg-slate-100
          dark:hover:bg-slate-800
          transition
          ">

            <Bell size={18} />

          </button>

          {/* notification dot */}

          <span className="
          absolute
          top-1
          right-1
          w-2
          h-2
          bg-red-500
          rounded-full
          " />

        </div>

        {/* USER PROFILE */}

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">

          <div className="
          w-9 h-9
          rounded-full
          bg-gradient-to-r
          from-indigo-500
          via-purple-500
          to-blue-500
          flex items-center
          justify-center
          text-white
          text-sm
          font-semibold
          ">

            AS

          </div>

        </div>

      </div>

    </header>
  )
}