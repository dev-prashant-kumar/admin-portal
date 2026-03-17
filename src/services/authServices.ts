import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/* LOGIN ADMIN */
export async function loginAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error 
  return data
}

/* LOGOUT ADMIN */
export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error

  window.location.href = "/admin-login"
}

/* GET CURRENT USER (SECURE) */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) return null
  return user
}