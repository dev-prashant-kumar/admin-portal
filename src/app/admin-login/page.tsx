"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginAdmin } from "@/services/authServices";

export default function AdminAuth() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await loginAdmin(email, password);

      toast.success("Login successful");

      window.location.href = "/admin/dashboard"
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/admin-bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative flex w-[1000px] rounded-3xl overflow-hidden shadow-2xl">
        {/* LEFT */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-10 rounded-3xl text-center text-white shadow-xl">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-orange-400 to-green-400 bg-clip-text text-transparent">
              12thFailJobs
            </h1>

            <p className="mt-3 text-lg text-white/90">
              Empowering India's Real Workforce
            </p>

            <div className="mt-6 space-y-3 text-white/90">
              <p>• Manage workers and recruiters</p>
              <p>• Approve or reject job listings</p>
              <p>• Monitor complaints and reports</p>
              <p>• Track platform activity</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-1/2 flex items-center justify-center bg-white p-10">
          <div className="w-[350px]">
            <h2 className="text-3xl font-semibold text-center mb-6">
              Admin Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />

              <button
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 text-white font-semibold"
              >
                {loading ? "Please wait..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
