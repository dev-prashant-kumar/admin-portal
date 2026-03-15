export default function SprintProgress() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          Sprint 24
        </h2>

        <span className="text-sm text-slate-500">
          5 days remaining
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-indigo-500 w-[65%]" />
      </div>

      {/* Status */}
      <div className="flex justify-between text-sm">

        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Completed (14)
        </span>

        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          In Progress (5)
        </span>

        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-400"></span>
          To Do (2)
        </span>

      </div>

    </div>
  );
}