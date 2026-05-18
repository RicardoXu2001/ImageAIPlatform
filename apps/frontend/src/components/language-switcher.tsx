"use client";

import { Languages } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const options: Array<{ label: string; value: Language }> = [
  { label: "中文", value: "zh-CN" },
  { label: "EN", value: "en" }
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1">
      <Languages size={15} className="ml-2 text-white/[0.58]" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={cn(
            "h-7 rounded-full px-3 text-xs transition",
            language === option.value ? "bg-white text-black" : "text-white/[0.62] hover:text-white"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
