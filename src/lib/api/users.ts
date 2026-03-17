import { supabase } from "@/lib/supabaseClient"

/* GET ALL WORKERS */
export async function getWorkers() {
  const { data } = await supabase
    .from("workers")
    .select("*")
    .order("created_at", { ascending: false })

  return data || []
}

/* GET ALL RECRUITERS */
export async function getRecruiters() {
  const { data } = await supabase
    .from("recruiters")
    .select("*")
    .order("created_at", { ascending: false })

  return data || []
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