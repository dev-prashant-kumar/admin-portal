import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
    <p className="text-sm text-slate-500">Total Workers</p>
    <h2 className="text-3xl font-bold mt-2">1,254</h2>
  </div>

  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
    <p className="text-sm text-slate-500">Total Recruiters</p>
    <h2 className="text-3xl font-bold mt-2">348</h2>
  </div>

  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
    <p className="text-sm text-slate-500">Active Jobs</p>
    <h2 className="text-3xl font-bold mt-2">96</h2>
  </div>

  <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
    <p className="text-sm text-slate-500">Pending Approvals</p>
    <h2 className="text-3xl font-bold mt-2">12</h2>
  </div>

</div>
  )
}