import { supabase } from "@/lib/supabaseClient"

/* LOGIN ADMIN */

export async function loginAdmin(email: string, password: string) {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}


/* LOGOUT ADMIN */

export async function logoutAdmin() {

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  return true
}


/* GET CURRENT USER */

export async function getCurrentUser() {

  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return data.user
}