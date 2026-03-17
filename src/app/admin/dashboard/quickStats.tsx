"use client";

import { useEffect, useState } from "react";
import StatCard from "./statsCard";
import { Users, Rocket, MailOpen, UserPen } from "lucide-react";

import {
  getWorkersCount,
  getRecruitersCount,
  getActiveJobsCount,
  getPendingJobsCount,
  getComplaintsCount,
} from "@/lib/api/stats";

export default function QuickStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    pendingJobs: 0,
    complaints: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [workers, recruiters, activeJobs, pendingJobs, complaints] =
          await Promise.all([
            getWorkersCount(),
            getRecruitersCount(),
            getActiveJobsCount(),
            getPendingJobsCount(),
            getComplaintsCount(),
          ]);

        setStats({
          totalUsers: workers + recruiters,
          activeJobs,
          pendingJobs,
          complaints,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }

      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-purple-300 dark:bg-slate-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        change="+6.3%" // later you can calculate real %
        icon={<Users />}
      />

      <StatCard
        title="Active Jobs"
        value={stats.activeJobs.toLocaleString()}
        change="+10.1%"
        icon={<Rocket />}
      />

      <StatCard
        title="Pending Jobs"
        value={stats.pendingJobs.toLocaleString()}
        change="-3.4%"
        icon={<UserPen />}
      />

      <StatCard
        title="Complaints"
        value={stats.complaints.toLocaleString()}
        change="+2.1%"
        icon={<MailOpen />}
      />
    </div>
  );
}
