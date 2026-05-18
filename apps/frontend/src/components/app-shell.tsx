"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { t } = useLanguage();

  return (
    <main className="noise min-h-screen">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-full bg-white text-black">
            <Sparkles size={16} />
          </span>
          {t("brand")}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/[0.62] md:flex">
          <Link href="/generate" className="hover:text-white">{t("navGenerate")}</Link>
          <Link href="/history" className="hover:text-white">{t("navHistory")}</Link>
          <Link href="/pricing" className="hover:text-white">{t("navPricing")}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="secondary">{t("signIn")}</Button>
        </div>
      </header>
      {children}
    </main>
  );
}
