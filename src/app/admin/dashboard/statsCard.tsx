import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number; // ✅ FIXED
  change?: string;
  icon?: ReactNode;
};

export default function StatCard({
  title,
  value,
  change,
  icon,
}: StatCardProps) {
  // ✅ Auto format numbers
  const formattedValue =
    typeof value === "number" ? value.toLocaleString() : value;

  // ✅ Detect positive / negative change
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");

  return (
    <div
      className="flex items-center justify-between rounded-xl p-5 
bg-white/10 backdrop-blur-md border border-white/10 text-white
hover:bg-white/20 hover:shadow-lg hover:shadow-blue-500/10 transition"
    >
      <div>
        <p className="text-sm text-white/70">{title}</p>

        <h2 className="text-2xl font-semibold">{formattedValue}</h2>

        {change && (
          <p
            className={`text-sm mt-1 ${
              isPositive
                ? "text-green-300"
                : isNegative
                ? "text-red-300"
                : "text-white/70"
            }`}
          >
            {change} vs last month
          </p>
        )}
      </div>

      <div className="text-2xl opacity-80">{icon}</div>
    </div>
  );
}
