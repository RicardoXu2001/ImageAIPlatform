"use client";

import Link from "next/link";
import { ArrowRight, Images, ShieldCheck, WalletCards } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLanguage();
  const features = [
    { icon: Images, title: t("featureOneTitle"), text: t("featureOneText") },
    { icon: WalletCards, title: t("featureTwoTitle"), text: t("featureTwoText") },
    { icon: ShieldCheck, title: t("featureThreeTitle"), text: t("featureThreeText") }
  ];

  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm text-white/[0.58]">{t("heroEyebrow")}</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/[0.66]">
            {t("heroDescription")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/generate">{t("startGenerating")} <ArrowRight size={16} /></Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/history">{t("viewHistory")}</Link>
            </Button>
          </div>
        </div>
        <Card className="min-h-[440px] overflow-hidden p-4">
          <div className="grid h-full grid-rows-[1fr_auto] gap-4">
            <div className="rounded-md border border-white/10 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,.24),transparent_18rem),linear-gradient(135deg,#0a0d14,#192335_45%,#050608)]" />
            <div className="grid grid-cols-3 gap-3 text-xs text-white/[0.64]">
              <div className="rounded-md bg-white/[0.08] p-3">gpt-image-1</div>
              <div className="rounded-md bg-white/[0.08] p-3">1024 x 1024</div>
              <div className="rounded-md bg-white/[0.08] p-3">Queued</div>
            </div>
          </div>
        </Card>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="p-5">
            <feature.icon className="mb-5 text-white/[0.78]" size={22} />
            <h2 className="text-base font-medium">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/[0.58]">{feature.text}</p>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
