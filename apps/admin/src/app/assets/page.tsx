import { AdminShell } from "@/components/admin-shell";

export default function AssetsPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Assets</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="aspect-square rounded-lg border border-white/10 bg-white/[0.045]" />
        ))}
      </div>
    </AdminShell>
  );
}
