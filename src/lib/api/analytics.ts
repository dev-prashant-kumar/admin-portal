import { supabase } from "@/lib/supabaseClient"

// 1. Define the shape of your Database Row
interface DbRow {
  created_at: string;
}

// Helper to ensure months appear in order: Jan, Feb, Mar...
const MONTHS_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* JOBS OVER TIME */
export async function getJobsOverTime() {
  const { data } = await supabase
    .from("job_moderation")
    .select("created_at")

  // 2. Cast the data to our interface
  const typedData = (data as DbRow[]) || []

  const grouped: Record<string, number> = {}

  typedData.forEach((job) => {
    const month = new Date(job.created_at).toLocaleString("default", {
      month: "short"
    })
    grouped[month] = (grouped[month] || 0) + 1
  })

  // 3. Sort the final array chronologically
  return Object.entries(grouped)
    .map(([month, jobs]) => ({ month, jobs }))
    .sort((a, b) => MONTHS_ORDER.indexOf(a.month) - MONTHS_ORDER.indexOf(b.month))
}

/* USER GROWTH */
export async function getUserGrowth() {
  const { data } = await supabase
    .from("user_reports")
    .select("created_at")

  const typedData = (data as DbRow[]) || []

  const grouped: Record<string, number> = {}

  typedData.forEach((user) => {
    const month = new Date(user.created_at).toLocaleString("default", {
      month: "short"
    })
    grouped[month] = (grouped[month] || 0) + 1
  })

  return Object.entries(grouped)
    .map(([month, users]) => ({ month, users }))
    .sort((a, b) => MONTHS_ORDER.indexOf(a.month) - MONTHS_ORDER.indexOf(b.month))
}