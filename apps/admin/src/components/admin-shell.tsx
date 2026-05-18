"use client";

import Link from "next/link";
import { Activity, CreditCard, Images, LayoutDashboard, Settings, Users } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n";

const nav = [
  { href: "/", labelKey: "navDashboard", icon: LayoutDashboard },
  { href: "/users", labelKey: "navUsers", icon: Users },
  { href: "/tasks", labelKey: "navTasks", icon: Activity },
  { href: "/assets", labelKey: "navAssets", icon: Images },
  { href: "/billing", labelKey: "navBilling", icon: CreditCard },
  { href: "/settings", labelKey: "navSettings", icon: Settings }
] as const;

export function AdminShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#07090d]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-white/[0.035] p-4 lg:block">
        <div className="mb-8 px-2 text-sm font-semibold">{t("brand")}</div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/[0.62] hover:bg-white/[0.08] hover:text-white"
            >
              <item.icon size={16} />
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-white/10 px-4 sm:px-6">
          <p className="text-sm text-white/[0.58]">{t("operationsConsole")}</p>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/[0.58]">
              {t("role")}
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </section>
    </main>
  );
}
