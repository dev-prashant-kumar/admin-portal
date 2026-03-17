// lib/auth.ts
import { supabase } from "@/lib/supabaseClient"

/* LOGIN ADMIN */
export async function loginAdmin(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)

  return data
}

/* LOGOUT ADMIN */
export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)

  window.location.href = "/admin-login"
}

/* GET CURRENT USER (SAFE) */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession()
  return data.session?.user ?? null
}