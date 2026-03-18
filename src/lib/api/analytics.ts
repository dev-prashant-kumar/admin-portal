import { supabase } from "@/lib/supabaseClient"

// 1. Define types for your database rows to satisfy TypeScript
interface DbRow {
  created_at: string;
  status?: string;
  category?: string;
}

const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getTotalUsers(): Promise<number> {
  const { count } = await supabase.from("user_reports").select("*", { count: "exact", head: true });
  return count || 0;
}

export async function getTotalJobs(): Promise<number> {
  const { count } = await supabase.from("job_moderation").select("*", { count: "exact", head: true });
  return count || 0;
}

export async function getTotalComplaints(): Promise<number> {
  const { count } = await supabase.from("job_moderation").select("*", { count: "exact", head: true });
  return count || 0;
}

export async function getJobsOverTime() {
  const { data } = await supabase.from("job_moderation").select("created_at");
  
  // Cast data to our typed interface
  const typedData = (data as DbRow[]) || [];
  const grouped: Record<string, number> = {};

  typedData.forEach((job) => {
    const month = new Date(job.created_at).toLocaleString("default", { month: "short" });
    grouped[month] = (grouped[month] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([month, jobs]) => ({ month, jobs }))
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month));
}

export async function getUserGrowth() {
  const { data } = await supabase.from("user_reports").select("created_at");
  
  const typedData = (data as DbRow[]) || [];
  const grouped: Record<string, number> = {};

  typedData.forEach((user) => {
    const month = new Date(user.created_at).toLocaleString("default", { month: "short" });
    grouped[month] = (grouped[month] || 0) + 1;
  });

  return Object.entries(grouped)
    .map(([month, users]) => ({ month, users }))
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month));
}

export async function getJobStatusStats() {
  const { data } = await supabase.from("job_moderation").select("status");
  
  const typedData = (data as DbRow[]) || [];
  const stats = { approved: 0, pending: 0, rejected: 0 };

  typedData.forEach((job) => {
    const s = job.status as keyof typeof stats;
    if (s && s in stats) stats[s]++;
  });

  return stats;
}

export async function getTopCategories() {
  const { data } = await supabase.from("job_moderation").select("category");
  
  const typedData = (data as DbRow[]) || [];
  const grouped: Record<string, number> = {};

  typedData.forEach((job) => {
    if (job.category) {
      grouped[job.category] = (grouped[job.category] || 0) + 1;
    }
  });

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}