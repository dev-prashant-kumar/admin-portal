import { supabase } from "@/lib/supabaseClient"

/* TYPES */

export type Activity = {
  id: string
  activity_type: "job" | "user" | "complaint"
  description: string | null
  created_at: string
}

export type ActivitySummary = {
  total: number
  jobs: number
  users: number
  complaints: number
}

/* 🔥 GET ALL ACTIVITY */

export async function getAllActivity(filter: string) {
  let query = supabase
    .from("system_activity")
    .select("*")
    .order("created_at", { ascending: false })

  // 🎯 FILTER
  if (filter === "jobs") query = query.eq("activity_type", "job_approved")
  if (filter === "users") query = query.eq("activity_type", "user_signup")
  if (filter === "complaints") query = query.eq("activity_type", "report_created")

  const { data, error } = await query

  if (error) {
    console.error(error)
    return []
  }

  return data as Activity[]
}

/* 🔥 SUMMARY */

export async function getActivitySummary(): Promise<ActivitySummary> {
  const { data, error } = await supabase
    .from("system_activity")
    .select("activity_type")

  if (error || !data) {
    return { total: 0, jobs: 0, users: 0, complaints: 0 }
  }

  // ✅ FIX: TYPE THE DATA
  const typedData = data as { activity_type: string }[]

  return {
    total: typedData.length,
    jobs: typedData.filter((d) => d.activity_type === "job").length,
    users: typedData.filter((d) => d.activity_type === "user").length,
    complaints: typedData.filter((d) => d.activity_type === "complaint").length
  }
}

/* 🔥 INSERT ACTIVITY (IMPORTANT) */

export async function addActivity(type: "job" | "user" | "complaint", description: string) {
  const { error } = await supabase
    .from("system_activity")
    .insert({
      activity_type: type,
      description
    })

  if (error) throw error
}

export async function getRecentActivity() {
  const { data, error } = await supabase
    .from("system_activity")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) {
    console.error(error)
    return []
  }

  return data
}