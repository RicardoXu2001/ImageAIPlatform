"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "zh-CN" | "en";

const dictionaries = {
  "zh-CN": {
    brand: "Astra Admin",
    operationsConsole: "运营控制台",
    role: "super_admin",
    navDashboard: "仪表盘",
    navUsers: "用户",
    navTasks: "任务",
    navAssets: "资产",
    navBilling: "支付",
    navSettings: "设置",
    dashboardTitle: "仪表盘",
    metricTasksToday: "今日任务",
    metricQueueDepth: "队列积压",
    metricRevenue: "收入",
    metricAiCost: "AI 成本",
    queueHealth: "队列健康",
    waiting: "等待中",
    active: "处理中",
    failed: "失败",
    completed: "已完成",
    usersTitle: "用户管理",
    statusActive: "ACTIVE",
    credits: "1,240 积分",
    tasksTitle: "AI 任务队列",
    tasksDescription: "在这里按状态、供应商、模型和用户筛选任务，并重试失败任务。",
    assetsTitle: "图片资产",
    billingTitle: "支付管理",
    billingDescription: "Stripe 支付、订阅状态、退款和手动发放 Credits 都在这里处理。",
    settingsTitle: "系统设置",
    settingsDescription: "模型可用性、Credits 定价、存储、安全规则和功能开关。"
  },
  en: {
    brand: "Astra Admin",
    operationsConsole: "Operations console",
    role: "super_admin",
    navDashboard: "Dashboard",
    navUsers: "Users",
    navTasks: "Tasks",
    navAssets: "Assets",
    navBilling: "Billing",
    navSettings: "Settings",
    dashboardTitle: "Dashboard",
    metricTasksToday: "Tasks today",
    metricQueueDepth: "Queue depth",
    metricRevenue: "Revenue",
    metricAiCost: "AI cost",
    queueHealth: "Queue health",
    waiting: "Waiting",
    active: "Active",
    failed: "Failed",
    completed: "Completed",
    usersTitle: "Users",
    statusActive: "ACTIVE",
    credits: "1,240 credits",
    tasksTitle: "AI task queue",
    tasksDescription: "Filter by status, provider, model, user, and retry failed tasks from this surface.",
    assetsTitle: "Assets",
    billingTitle: "Billing",
    billingDescription: "Stripe payments, subscription state, refunds, and manual credit grants live here.",
    settingsTitle: "Settings",
    settingsDescription: "Model availability, credit pricing, storage, safety rules, and feature flags."
  }
} as const;

type TranslationKey = keyof typeof dictionaries.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [language, setLanguageState] = useState<Language>("zh-CN");

  useEffect(() => {
    const stored = window.localStorage.getItem("astra-admin-language");
    if (stored === "zh-CN" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem("astra-admin-language", nextLanguage);
      },
      t: (key) => dictionaries[language][key]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}
