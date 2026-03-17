"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
// 1. Import the specific types from Supabase
import type { AuthChangeEvent, Session } from "@supabase/supabase-js"

type Admin = {
  id: string
  name: string
  email: string
  role_id: string
  role_name: string
  role_description: string
}

type AuthContextType = {
  admin: Admin | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  admin: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdmin() {
      // Using getUser() for better security as discussed before
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setAdmin(null)
        setLoading(false)
        return
      }

      const { data: adminData } = await supabase.rpc("get_current_admin")

      // RPC usually returns an array or single object depending on your SQL logic
      setAdmin(adminData?.[0] || null)
      setLoading(false)
    }

    fetchAdmin()

    // 2. Explicitly type the parameters here
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        fetchAdmin()
      } else {
        setAdmin(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ admin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)