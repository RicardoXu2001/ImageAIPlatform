"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createGenerationTask, getGenerationTask } from "@/lib/api-client";
import { useLanguage } from "@/lib/i18n";

type ResultAsset = {
  id: string;
  url: string | null;
};

export default function GeneratePage() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState("IDLE");
  const [assets, setAssets] = useState<ResultAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setAssets([]);
    setStatus("QUEUING");

    try {
      const task = await createGenerationTask({
        prompt,
        size: "1024x1024",
        quality: "auto",
        outputFormat: "png",
        count: 1
      });

      setTaskId(task.taskId);
      await poll(task.taskId);
    } catch (err) {
      setStatus("FAILED");
      setError(err instanceof Error ? err.message : "Failed to create image.");
    }
  }

  async function poll(id: string) {
    for (let index = 0; index < 90; index += 1) {
      const task = await getGenerationTask(id);
      setStatus(task.status);
      setAssets(task.assets);

      if (task.status === "SUCCEEDED" || task.status === "FAILED" || task.status === "BLOCKED") {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  const busy = status === "QUEUING" || status === "QUEUED" || status === "PROCESSING";

  return (
    <AppShell>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 lg:grid-cols-[420px_1fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">{t("generateTitle")}</h1>
              <p className="mt-1 text-sm text-white/[0.54]">{t("generateHelp")}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/[0.58]">{t("credits")}</span>
          </div>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="min-h-56 w-full resize-none rounded-lg border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/[0.32] focus:border-white/[0.28]"
            placeholder={t("promptPlaceholder")}
          />
          <Button disabled={!prompt.trim() || busy} className="mt-4 w-full" onClick={submit}>
            {busy ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            {t("generateImage")}
          </Button>
          {taskId ? <p className="mt-4 break-all text-xs text-white/[0.42]">{t("taskId")}: {taskId}</p> : null}
          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        </Card>
        <Card className="min-h-[560px] p-4">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-white/[0.62]">{t("preview")}</span>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-xs text-white/[0.58]">{status}</span>
          </div>
          <div className="grid min-h-[500px] place-items-center rounded-md border border-white/10 bg-black/25">
            {assets[0]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assets[0].url} alt="Generated result" className="max-h-[500px] rounded-md object-contain" />
            ) : (
              <p className="max-w-sm text-center text-sm leading-6 text-white/[0.42]">
                {t("previewEmpty")}
              </p>
            )}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
