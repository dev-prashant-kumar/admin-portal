export default function TeamActivity() {
  const activities = [
    {
      initials: "SC",
      name: "Sarah C.",
      action: "merged PR #284",
      time: "3m"
    },
    {
      initials: "AM",
      name: "Alex M.",
      action: "deployed to production",
      time: "12m"
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Team Activity
        </h2>

        <button className="text-sm text-indigo-500 hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">

        {activities.map((item, index) => (
          <div key={index} className="flex items-center gap-3">

            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-semibold">
              {item.initials}
            </div>

            <div className="flex-1 text-sm">
              <span className="font-medium text-slate-800 dark:text-white">
                {item.name}
              </span>{" "}
              {item.action}
            </div>

            <span className="text-xs text-slate-400">
              {item.time}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}