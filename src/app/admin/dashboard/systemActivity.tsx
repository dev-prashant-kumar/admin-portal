"use client";

import { useEffect, useState } from "react";
import { getRecentActivity } from "@/lib/api/activityLogs";
import { useRouter } from "next/navigation";


type Activity = {
  id: string;
  activity_type: string;
  description: string;
  user_name: string;
  created_at: string;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const data = await getRecentActivity();
      setActivities(data);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-xl" />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">
      <div className="mb-4 justify-center">
        <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Recent Activity
        </h2>
        </div>
        <div>
          <button
          onClick={() => router.push("/admin/activity")}
          className="text-sm text-indigo-500 hover:underline"
        >
          View all
        </button>
        </div>
        
      </div>
      

      <div className="space-y-4">
        {activities.map((item) => {
          const timeAgo = getTimeAgo(item.created_at);

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
                {item.user_name?.charAt(0) || "A"}
              </div>

              <div className="flex-1 text-sm">
                <span className="font-medium text-slate-800 dark:text-white">
                  {item.user_name || "System"}
                </span>{" "}
                {item.description}
              </div>

              <span className="text-xs text-slate-400">{timeAgo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* TIME FORMAT */
function getTimeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  return `${Math.floor(diff / 86400)}d`;
}
