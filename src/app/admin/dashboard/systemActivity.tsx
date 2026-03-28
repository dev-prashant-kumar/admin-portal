"use client";

import { useEffect, useState } from "react";
import { getRecentActivity } from "@/lib/api/activityLogs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Activity = {
  id: string;
  activity_type: "job" | "user" | "complaint";
  description: string | null;
  created_at: string;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getRecentActivity();
        setActivities(data || []);
      } catch (err) {
        console.error("Recent activity error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-2xl p-5">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
          Recent Activity
        </h3>

        <button
          onClick={() => router.push("/admin/activity")}
          className="text-xs text-indigo-500 hover:underline"
        >
          View all
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-6 text-slate-400">
          <Loader2 className="animate-spin" size={18} />
        </div>
      ) : activities.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-6">
          No recent activity
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 p-3 rounded-xl 
              hover:bg-slate-50 dark:hover:bg-indigo-500/5 transition"
            >
              {/* DOT */}
              <div className={`w-2 h-2 mt-2 rounded-full ${getDotColor(a.activity_type)}`} />

              {/* TEXT */}
              <div className="flex-1">
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {a.description || "No description"}
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  {getTimeAgo(a.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🎨 HELPERS */

function getDotColor(type: string) {
  if (type === "job") return "bg-indigo-500";
  if (type === "user") return "bg-blue-500";
  if (type === "complaint") return "bg-red-500";
  return "bg-slate-400";
}

function getTimeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;

  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}