import { supabase } from "@/lib/supabaseClient"

// ✅ Get complaints
export async function getComplaints() {
  const { data, error } = await supabase
    .from("complaints_management")
    .select(`
      *,
      admin:handled_by ( id, name )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// ✅ Update complaint
export async function updateComplaint(id: string, updates: any) {
  const { error } = await supabase
    .from("complaints_management")
    .update(updates)
    .eq("id", id)

  if (error) throw error
}