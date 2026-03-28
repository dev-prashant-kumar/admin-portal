"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabaseClient"
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
  
  // Use a ref to track if an initial fetch is already in progress
  const isFetching = useRef(false)

  useEffect(() => {
    async function fetchAdmin() {
      // Prevent concurrent calls from overlapping
      if (isFetching.current) return
      isFetching.current = true

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          setAdmin(null)
          return
        }

        const { data: adminData, error: rpcError } = await supabase.rpc("get_current_admin")
        
        if (rpcError) {
          console.error("RPC Error:", rpcError)
          setAdmin(null)
        } else {
          // RPC returns results; handle based on your SQL return type
          setAdmin(Array.isArray(adminData) ? adminData[0] : adminData || null)
        }
      } catch (err) {
        console.error("Auth fetch failed:", err)
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    }

    // Initialize
    fetchAdmin()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await fetchAdmin()
      } else if (event === 'SIGNED_OUT') {
        setAdmin(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ admin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)