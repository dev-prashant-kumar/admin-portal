"use client";

import { useState } from "react";
import { Search, Bell, Moon, Sun, Plus, Command } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const { admin } = useAuth();

  function toggleDark() {
    setDarkMode(!darkMode);

    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <header
      className="h-[70px] border-b border-slate-200 dark:border-slate-800
    bg-white/70 dark:bg-slate-950/70
    backdrop-blur-xl
    flex items-center justify-between
    px-6"
    >
      {/* LEFT SIDE */}

      <div className="flex items-center gap-4">
        {/* SEARCH */}

        <div className="group relative hidden md:block w-[320px]">
  {/* The Gradient Border Wrapper */}
  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 opacity-20 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
  
  <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
    {/* Search Icon - Colors shift on focus */}
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
    />

    <input
      placeholder="Search anything..."
      className="
        w-full
        pl-10 pr-16 py-2.5
        bg-transparent
        text-sm text-slate-900 dark:text-slate-100
        outline-none
        placeholder:text-slate-400
        /* Standard border for when the gradient is low opacity */
        border border-slate-200 dark:border-slate-800 
        group-hover:border-transparent group-focus-within:border-transparent
        rounded-xl
        transition-all
      "
    />

    {/* CMD K Shortcut */}
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-medium text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-lg bg-slate-50 dark:bg-slate-800 group-focus-within:border-orange-500/50 transition-colors">
      <Command size={11} />
      <span>K</span>
    </div>
  </div>
</div>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-3">
        {/* NEW BUTTON */}


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
          <button
            className="
          p-2
          rounded-lg
          hover:bg-slate-100
          dark:hover:bg-slate-800
          transition
          "
          >
            <Bell size={18} />
          </button>

          {/* notification dot */}

          <span
            className="
          absolute
          top-1
          right-1
          w-2
          h-2
          bg-red-500
          rounded-full
          "
          />
        </div>

        {/* USER PROFILE */}

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
          <img
            src={
              `https://api.dicebear.com/7.x/initials/svg?seed=${admin?.name}`
            }
            alt={admin?.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
