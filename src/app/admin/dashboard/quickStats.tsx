import StatCard from "./statsCard";
import { Users, DollarSign, Activity, Rocket } from "lucide-react";

export default function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

      <StatCard
        title="MRR"
        value="$48.2K"
        change="+12.4%"
        icon={<DollarSign />}
      />

      <StatCard
        title="Active Users"
        value="12,847"
        change="+8.2%"
        icon={<Users />}
      />

      <StatCard
        title="Deployments"
        value="342"
        change="+24.1%"
        icon={<Rocket />}
      />

      <StatCard
        title="Uptime"
        value="99.98%"
        change="+0.02%"
        icon={<Activity />}
      />

    </div>
  );
}