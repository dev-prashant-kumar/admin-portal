"use client"

import { useState } from "react"

export default function AdminAuth() {

  const [isLogin, setIsLogin] = useState(true)

  return (

    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/admin-bg.png')" }}
    >

      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* MAIN CONTENT */}
      <div className="relative flex w-[1000px] rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SECTION */}
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


        {/* RIGHT SECTION */}
        <div className="w-1/2 flex items-center justify-center bg-white p-10">

          <div className="w-[350px]">

            <h2 className="text-3xl font-semibold text-center mb-6">
              {isLogin ? "Admin Login" : "Admin Signup"}
            </h2>

            <form className="space-y-4">

              {!isLogin && (
                <input
                  type="text"
                  placeholder="Admin Name"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}

              <input
                type="email"
                placeholder="Admin Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />

              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              )}

              <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 text-white font-semibold">
                {isLogin ? "Login" : "Create Admin"}
              </button>

            </form>

            <p className="text-center mt-5 text-gray-600">

              {isLogin
                ? "Don't have an admin account?"
                : "Already have an account?"
              }

              <span
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-600 cursor-pointer"
              >
                {isLogin ? "Signup" : "Login"}
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>

  )
}