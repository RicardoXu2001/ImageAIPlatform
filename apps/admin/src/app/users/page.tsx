"use client";

import { AdminShell } from "@/components/admin-shell";
import { useLanguage } from "@/lib/i18n";

const users = ["demo@example.com", "creator@example.com", "ops@example.com"];

export default function UsersPage() {
  const { t } = useLanguage();

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">{t("usersTitle")}</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
        {users.map((email) => (
          <div key={email} className="grid grid-cols-3 border-b border-white/10 p-4 text-sm last:border-b-0">
            <span>{email}</span>
            <span className="text-white/[0.58]">{t("statusActive")}</span>
            <span className="text-right text-white/[0.58]">{t("credits")}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
