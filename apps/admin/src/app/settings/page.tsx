"use client";

import { AdminShell } from "@/components/admin-shell";
import { useLanguage } from "@/lib/i18n";

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">{t("settingsTitle")}</h1>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm text-white/[0.62]">
        {t("settingsDescription")}
      </div>
    </AdminShell>
  );
}
