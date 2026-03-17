import { supabase } from "@/lib/supabaseClient"

/* TOTAL WORKERS */
export async function getWorkersCount() {
  const { count } = await supabase
    .from("worker")
    .select("*", { count: "exact", head: true })

  return count || 0
}

/* TOTAL RECRUITERS */
export async function getRecruitersCount() {
  const { count } = await supabase
    .from("recruiter")
    .select("*", { count: "exact", head: true })

  return count || 0
}

/* ACTIVE JOBS */
export async function getActiveJobsCount() {
  const { count } = await supabase
    .from("job_moderation")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  return count || 0
}

/* PENDING JOBS */
export async function getPendingJobsCount() {
  const { count } = await supabase
    .from("job_moderation")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  return count || 0
}

/* TOTAL COMPLAINTS */
export async function getComplaintsCount() {
  const { count } = await supabase
    .from("complaints_management")
    .select("*", { count: "exact", head: true })

  return count || 0
}