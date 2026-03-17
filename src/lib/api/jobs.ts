import { supabase } from "@/lib/supabaseClient"

/* GET ALL JOBS */
export async function getJobs() {
  const { data } = await supabase
    .from("job_moderation")
    .select("*")
    .order("created_at", { ascending: false })

  return data || []
}

/* GET RECENT JOBS */
export async function getRecentJobs() {
  const { data } = await supabase
    .from("job_moderation")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  return data || []
}

/* APPROVE JOB */
export async function approveJob(id: string) {
  return await supabase
    .from("job_moderation")
    .update({ status: "approved" })
    .eq("id", id)
}

/* REJECT JOB */
export async function rejectJob(id: string) {
  return await supabase
    .from("job_moderation")
    .update({ status: "rejected" })
    .eq("id", id)
}

/* DELETE JOB */
export async function deleteJob(id: string) {
  return await supabase
    .from("job_moderation")
    .delete()
    .eq("id", id)
}

type JobRow = {
  created_at: string
}

type JobChartData = {
  month: string
  jobs: number
}

export async function getJobsPostedOverTime(): Promise<JobChartData[]> {

  const { data, error } = await supabase
    .from("job_moderation")
    .select("created_at")

  if (error) {
    console.error(error)
    return []
  }

  const jobsData = (data || []) as JobRow[]

  const grouped: Record<string, number> = {}

  jobsData.forEach((job) => {
    const date = new Date(job.created_at)
    const month = date.toLocaleString("default", { month: "short" })

    grouped[month] = (grouped[month] || 0) + 1
  })

  return Object.entries(grouped).map(([month, jobs]) => ({
    month,
    jobs
  }))
}

export async function getRejectedJobsCount() {
  return supabase
    .from("job_moderation")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected")
}