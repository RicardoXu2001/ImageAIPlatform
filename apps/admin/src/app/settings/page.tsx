import { AdminShell } from "@/components/admin-shell";

export default function SettingsPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm text-white/[0.62]">
        Model availability, credit pricing, storage, safety rules, and feature flags.
      </div>
    </AdminShell>
  );
}
