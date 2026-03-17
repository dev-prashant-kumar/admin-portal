import { supabase } from "@/lib/supabaseClient"

/* GET ALL COMPLAINTS */
export async function getComplaints() {
  const { data } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false })

  return data || []
}

/* RESOLVE COMPLAINT */
export async function resolveComplaint(id: string) {
  return await supabase
    .from("complaints")
    .update({ status: "resolved" })
    .eq("id", id)
}