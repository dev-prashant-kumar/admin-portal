import { supabase } from "@/lib/supabaseClient"

/* GET ALL JOBS */
export async function getJobs() {
  const { data } = await supabase
    .from("jobs")
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
    .from("jobs")
    .update({ status: "rejected" })
    .eq("id", id)
}

/* DELETE JOB */
export async function deleteJob(id: string) {
  return await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
}
export async function markFakeJob(id: number, value: boolean) {
  const { error } = await supabase
    .from("jobs")
    .update({ is_fake: value })
    .eq("id", id)

  if (error) throw error
}

/* GET REJECTED JOBS COUNT */
export async function getRejectedJobsCount(): Promise<number> {
  const { count } = await supabase
    .from("job_moderation")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected");
  
  return count ?? 0; // Return just the number
}

// 1. Define the shape of a single row from your database
interface JobModerationRow {
  created_at: string;
  // add other fields if you use them, e.g., id: string; status: string;
}

// 2. Define the shape of the data for your chart
export type JobChartData = {
  month: string;
  jobs: number;
};

export async function getJobsPostedOverTime(): Promise<JobChartData[]> {
  const { data, error } = await supabase
    .from("job_moderation")
    .select("created_at");

  if (error) {
    console.error(error);
    return [];
  }

  // 3. Cast the data to your interface to remove the 'any' error
  const jobsData = (data as JobModerationRow[]) || [];

  const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const grouped: Record<string, number> = {};

  // Now 'job' is typed as JobModerationRow instead of 'any'
  jobsData.forEach((job) => {
    const date = new Date(job.created_at);
    const month = date.toLocaleString("default", { month: "short" });
    grouped[month] = (grouped[month] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([month, jobs]) => ({ month, jobs }))
    .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month));
}

export async function getReportedJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_fake", true)   // ✅ ONLY FAKE JOBS
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}