import { supabase } from "@/lib/supabaseClient"

/* GET ALL WORKERS */
export async function getWorkers() {
  const { data, error } = await supabase
    .from("worker")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

/* UPDATE */
export async function updateWorker(id: number, updates: any) {
  const { data, error } = await supabase
    .from("worker")
    .update(updates)
    .eq("id", id)

  if (error) throw error
  return data
}

/* DELETE */
export async function deleteWorker(id: number) {
  const { error } = await supabase
    .from("worker")
    .delete()
    .eq("id", id)

  if (error) throw error
}

/* GET ALL RECRUITERS */
export async function getRecruiters() {
  const { data } = await supabase
    .from("recruiter")
    .select("*")
    .order("created_at", { ascending: false })

  return data || []
}

export async function updateRecruiter(id: number, updates: any) {
  const { data, error } = await supabase
    .from("recruiter")
    .update(updates)
    .eq("id", id)
    .select() // ✅ returns updated row

  if (error) {
    console.error("Update Recruiter Error:", error.message)
    throw error
  }

  return data
}

export async function deleteRecruiter(id: number) {
  const { error } = await supabase
    .from("recruiter")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Delete Recruiter Error:", error.message)
    throw error
  }

  return true
}

/* BLOCK USER */
export async function blockUser(id: string, table: "workers" | "recruiters") {
  return await supabase
    .from(table)
    .update({ status: "blocked" })
    .eq("id", id)
}

/* UNBLOCK USER */
export async function unblockUser(id: string, table: "workers" | "recruiters") {
  return await supabase
    .from(table)
    .update({ status: "active" })
    .eq("id", id)
}

export async function getAdmins() {
  const { data, error } = await supabase
    .from("admin_users")
    .select(`
      id,
      name,
      email,
      is_active,
      created_at,
      last_login,
      auth_user_id,
      role:admin_roles (
        id,
        role_name,
        description
      )
    `)

  if (error) {
    console.error("Error fetching admins:", error)
    return []
  }

  return data
}

export async function getRoles() {
  const { data, error } = await supabase
    .from("admin_roles")
    .select("*")

  if (error) {
    console.error(error)
    return []
  }

  return data
}

export async function updateAdmin(id: string, updates: any) {
  const { error } = await supabase
    .from("admin_users")
    .update(updates)
    .eq("id", id)

  if (error) throw error
}

export async function deleteAdmin(id: string) {
  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id)

  if (error) throw error
}

/* 🔥 CREATE ADMIN */

export async function createAdmin(data: {
  name: string
  email: string
  password: string
  role_id: string
}) {
  // 1️⃣ Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true
  })

  if (authError) throw authError

  // 2️⃣ Insert into admin_users
  const { error } = await supabase.from("admin_users").insert({
    name: data.name,
    email: data.email,
    role_id: data.role_id,
    auth_user_id: authData.user.id
  })

  if (error) throw error
}