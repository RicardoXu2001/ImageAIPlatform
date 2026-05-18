"use client";

import { AdminShell } from "@/components/admin-shell";
import { MetricCard } from "@/components/metric-card";
import { useLanguage } from "@/lib/i18n";

export default function DashboardPage() {
  const { t } = useLanguage();
  const metrics = [
    { label: t("metricTasksToday"), value: "1,284", delta: "+18%" },
    { label: t("metricQueueDepth"), value: "42", delta: "-6%" },
    { label: t("metricRevenue"), value: "$8,920", delta: "+11%" },
    { label: t("metricAiCost"), value: "$1,340", delta: "+4%" }
  ];

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">{t("dashboardTitle")}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-5">
        <h2 className="text-base font-medium">{t("queueHealth")}</h2>
        <div className="mt-5 grid gap-3 text-sm text-white/[0.62] md:grid-cols-4">
          <div>{t("waiting")}: 28</div>
          <div>{t("active")}: 14</div>
          <div>{t("failed")}: 3</div>
          <div>{t("completed")}: 18,204</div>
        </div>
      </div>
    </AdminShell>
  );
}
