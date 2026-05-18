"use client";

import { Check } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <AppShell>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-semibold">{t("pricingTitle")}</h1>
        <p className="mt-3 max-w-2xl text-white/[0.58]">{t("pricingDescription")}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Starter", "Pro", "Studio"].map((plan, index) => (
            <Card key={plan} className="p-5">
              <h2 className="text-lg font-medium">{plan}</h2>
              <p className="mt-4 text-3xl font-semibold">${[19, 49, 149][index]}</p>
              <div className="mt-5 space-y-3 text-sm text-white/[0.62]">
                <p className="flex gap-2"><Check size={16} /> {t("monthlyCredits")}</p>
                <p className="flex gap-2"><Check size={16} /> {t("historyDownloads")}</p>
                <p className="flex gap-2"><Check size={16} /> {t("commercialUsage")}</p>
              </div>
              <Button className="mt-6 w-full" variant={index === 1 ? "primary" : "secondary"}>{t("checkout")}</Button>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
