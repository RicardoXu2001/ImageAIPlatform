"use client";

import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export default function HistoryPage() {
  const { t } = useLanguage();

  return (
    <AppShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold">{t("historyTitle")}</h1>
        <p className="mt-2 text-sm text-white/[0.58]">{t("historyDescription")}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="aspect-square p-3">
              <div className="h-full rounded-md border border-white/10 bg-white/[0.04]" />
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
