import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string;
  change?: string;
  icon?: ReactNode;
};

export default function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl p-5 
    bg-white/10 backdrop-blur-md border border-white/10 text-white">

      <div>
        <p className="text-sm text-white/70">{title}</p>
        <h2 className="text-2xl font-semibold">{value}</h2>

        {change && (
          <p className="text-sm text-green-300 mt-1">
            {change} vs last month
          </p>
        )}
      </div>

      <div className="text-xl opacity-80">
        {icon}
      </div>
    </div>
  );
}