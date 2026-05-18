import { AdminShell } from "@/components/admin-shell";

export default function TasksPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">AI task queue</h1>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm text-white/[0.62]">
        Filter by status, provider, model, user, and retry failed tasks from this surface.
      </div>
    </AdminShell>
  );
}
