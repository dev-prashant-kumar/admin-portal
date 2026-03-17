"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

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
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        setAdmin(null)
        setLoading(false)
        return
      }

      const { data: adminData } = await supabase.rpc("get_current_admin")

      setAdmin(adminData?.[0] || null)
      setLoading(false)
    }

    fetchAdmin()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchAdmin()
      else {
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