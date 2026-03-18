import { supabase } from "../supabaseClient"

export type Activity = {
  id: string
  activity_type: string
  description: string
  user_name: string
  created_at: string
}

export type ActivitySummary = {
  todayCount: number
  activeMembers: number
  pendingJobs: number
  releases: number
}

/* GET RECENT ACTIVITY (Limit 3) */
export async function getRecentActivity(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("system_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching recent activity:", error)
    return []
  }

  return (data as Activity[]) || []
}

/* GET ALL ACTIVITY WITH FILTER */
export async function getAllActivity(filter: string): Promise<Activity[]> {
  let query = supabase
    .from("system_activity")
    .select("*")
    .order("created_at", { ascending: false })

  if (filter !== "all") {
    query = query.ilike("activity_type", `%${filter}%`)
  }

  const { data, error } = await query
  if (error) return []
  return (data as Activity[]) || []
}

export async function getActivitySummary(): Promise<ActivitySummary> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayRes, membersRes, pendingRes, releasesRes] = await Promise.all([
    supabase.from("system_activity").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    supabase.from("system_activity").select("user_name", { count: "exact", head: true }).neq("user_name", "System"),
    supabase.from("job_moderation").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("system_activity").select("*", { count: "exact", head: true }).eq("activity_type", "report_created")
  ])

  return {
    todayCount: todayRes.count || 0,
    activeMembers: membersRes.count || 0,
    pendingJobs: pendingRes.count || 0,
    releases: releasesRes.count || 0
  }
}