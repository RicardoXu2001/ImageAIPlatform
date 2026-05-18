"use client";

import { AdminShell } from "@/components/admin-shell";
import { useLanguage } from "@/lib/i18n";

export default function BillingPage() {
  const { t } = useLanguage();

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">{t("billingTitle")}</h1>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm text-white/[0.62]">
        {t("billingDescription")}
      </div>
    </AdminShell>
  );
}
