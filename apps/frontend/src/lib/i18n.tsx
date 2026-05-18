"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "zh-CN" | "en";

const dictionaries = {
  "zh-CN": {
    brand: "Astra Image",
    navGenerate: "生成",
    navHistory: "历史",
    navPricing: "价格",
    signIn: "登录",
    heroEyebrow: "企业级 AI 生图平台",
    heroTitle: "Astra Image",
    heroDescription: "一个可扩展的 AI 图片生成 SaaS，内置异步任务、Credits、支付、历史记录和管理端运营能力。",
    startGenerating: "开始生成",
    viewHistory: "查看历史",
    featureOneTitle: "从 Prompt 到生产级素材",
    featureOneText: "在专注的创作工作台中生成营销、产品和概念视觉。",
    featureTwoTitle: "内置 Credits 系统",
    featureTwoText: "每次生成都有可审计的积分消耗，并预留 Stripe 支付能力。",
    featureThreeTitle: "可运营的后台控制",
    featureThreeText: "基于队列的生成、管理审核、用户管理和可靠重试。",
    generateTitle: "生成图片",
    generateHelp: "描述你想创建的图片。",
    credits: "1,240 积分",
    promptPlaceholder: "湿润黑色石材上的玻璃香水瓶，电影级产品摄影...",
    generateImage: "生成图片",
    taskId: "任务 ID",
    preview: "预览",
    previewEmpty: "队列完成后，生成结果会显示在这里。",
    historyTitle: "图片历史",
    historyDescription: "生成的图片资产会按任务和模型展示在这里。",
    pricingTitle: "价格",
    pricingDescription: "Credits 可以从个人探索扩展到生产级创意团队。",
    monthlyCredits: "每月 Credits",
    historyDownloads: "历史记录和下载",
    commercialUsage: "商业使用权",
    checkout: "结账"
  },
  en: {
    brand: "Astra Image",
    navGenerate: "Generate",
    navHistory: "History",
    navPricing: "Pricing",
    signIn: "Sign in",
    heroEyebrow: "Enterprise AI image generation",
    heroTitle: "Astra Image",
    heroDescription:
      "A scalable AI image SaaS with async jobs, credits, payments, history, and admin operations.",
    startGenerating: "Start generating",
    viewHistory: "View history",
    featureOneTitle: "Prompt to production assets",
    featureOneText: "Generate campaign, product, and concept visuals from a focused workspace.",
    featureTwoTitle: "Credits built in",
    featureTwoText: "Meter every generation with auditable credit consumption and Stripe checkout.",
    featureThreeTitle: "Operational control",
    featureThreeText: "Queue-backed generation, admin review, user management, and reliable retries.",
    generateTitle: "Generate",
    generateHelp: "Describe the image you want to create.",
    credits: "1,240 credits",
    promptPlaceholder: "A cinematic product photo of a glass perfume bottle on wet black stone...",
    generateImage: "Generate image",
    taskId: "Task ID",
    preview: "Preview",
    previewEmpty: "Your generated image will appear here after the queue completes.",
    historyTitle: "Image history",
    historyDescription: "Generated assets will be listed here by task and model.",
    pricingTitle: "Pricing",
    pricingDescription: "Credits scale from solo exploration to production creative teams.",
    monthlyCredits: "Monthly credits",
    historyDownloads: "History and downloads",
    commercialUsage: "Commercial usage",
    checkout: "Checkout"
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
    const stored = window.localStorage.getItem("astra-language");
    if (stored === "zh-CN" || stored === "en") {
      setLanguageState(stored);
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        window.localStorage.setItem("astra-language", nextLanguage);
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
