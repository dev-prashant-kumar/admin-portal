"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import toast from "react-hot-toast";
import router from "next/router";


export default function AdminAuth() {

  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [loading,setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

  e.preventDefault()
  setLoading(true)

  try {

    if (isLogin) {

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast.success("Login successful")

      router.push("/admin/dashboard")

    } else {

      if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      await supabase
        .from("admin_users")
        .insert({
          email,
          name,
          role: "super_admin"
        })

      toast.success("Admin account created")

      setIsLogin(true)

    }

  } catch (err: any) {

    toast.error(err.message)

  }

  setLoading(false)
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
              {isLogin ? "Admin Login" : "Admin Signup"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <input
                  type="text"
                  placeholder="Admin Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              )}

              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg"
              />

              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              )}

              <button
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 text-white font-semibold"
              >

                {loading ? "Please wait..." : isLogin ? "Login" : "Create Admin"}

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
