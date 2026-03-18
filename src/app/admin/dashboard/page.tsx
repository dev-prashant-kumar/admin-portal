"use client"
import { useAuth } from "@/context/AuthContext";
import QuickStats from "./quickStats";
import TeamActivity from "./systemActivity";
import JobsChart from "./jobChart";
import JobStatusCard from "./jobProgress";

export default function DashboardPage() {
  const { admin } = useAuth();

  return (
    <div className="space-y-6 ">

      {/* Gradient Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">

        <h1 className="text-2xl font-semibold">
          Good morning, {admin?.name}
        </h1>

        <p className="text-sm opacity-80 mt-1 mb-6">
          Here's what's happening today.
        </p>

        <QuickStats />

      </div>

      {/* Dashboard Content */}
      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <JobsChart />
        </div>

        <div className="space-y-6">
          <JobStatusCard />
          <TeamActivity />
        </div>

      </div>

    </div>
  );
}