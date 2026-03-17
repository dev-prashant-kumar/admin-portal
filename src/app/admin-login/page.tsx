"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginAdmin, getCurrentUser } from "@/services/authServices"; // Added getCurrentUser
import { createBrowserClient } from "@supabase/ssr";

export default function AdminAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize client for the role check
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Log into Supabase Auth
      const { user } = await loginAdmin(email, password);

      if (!user) throw new Error("No user found");

      // 2. Check if this user actually exists in your admin_users table
      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("role_id")
        .eq("email", user.email)
        .single();

      if (adminError || !admin) {
        // Log them out immediately if they aren't an admin
        await supabase.auth.signOut();
        throw new Error("Access denied: You are not authorized as an admin.");
      }

      // 3. Only if they are a verified admin, proceed
      toast.success("Login successful");

      // Use router.push for SPA feel, or keep window.location for a hard refresh
      window.location.href = "/admin/dashboard";
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/admin-bg.png')" }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative flex w-full max-w-[1000px] mx-4 rounded-3xl overflow-hidden shadow-2xl">
        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-12 bg-transparent">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl text-center text-white shadow-xl">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
              12thFailJobs
            </h1>
            <p className="mt-3 text-lg text-white/90">
              Empowering India's Real Workforce
            </p>
            <div className="mt-6 space-y-3 text-left text-white/80 text-sm">
              <p>• Manage workers and recruiters</p>
              <p>• Approve or reject job listings</p>
              <p>• Monitor complaints and reports</p>
              <p>• Track platform activity</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (Login Form) */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10">
          <div className="w-full max-w-[350px]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Admin Portal</h2>
              <p className="text-gray-500 text-sm mt-2">
                Please enter your credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-orange-500 to-green-600 text-white font-bold shadow-lg hover:opacity-90 transition-opacity disabled:grayscale"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Login to Dashboard"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
