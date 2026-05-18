import { AdminShell } from "@/components/admin-shell";
import { MetricCard } from "@/components/metric-card";

const metrics = [
  { label: "Tasks today", value: "1,284", delta: "+18%" },
  { label: "Queue depth", value: "42", delta: "-6%" },
  { label: "Revenue", value: "$8,920", delta: "+11%" },
  { label: "AI cost", value: "$1,340", delta: "+4%" }
];

export default function DashboardPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-5">
        <h2 className="text-base font-medium">Queue health</h2>
        <div className="mt-5 grid gap-3 text-sm text-white/[0.62] md:grid-cols-4">
          <div>Waiting: 28</div>
          <div>Active: 14</div>
          <div>Failed: 3</div>
          <div>Completed: 18,204</div>
        </div>
      </div>
    </AdminShell>
  );
}
