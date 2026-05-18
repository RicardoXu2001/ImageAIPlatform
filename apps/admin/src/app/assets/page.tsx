"use client";

import { AdminShell } from "@/components/admin-shell";
import { useLanguage } from "@/lib/i18n";

export default function AssetsPage() {
  const { t } = useLanguage();

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">{t("assetsTitle")}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="aspect-square rounded-lg border border-white/10 bg-white/[0.045]" />
        ))}
      </div>
    </AdminShell>
  );
}
