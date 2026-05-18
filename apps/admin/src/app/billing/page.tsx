import { AdminShell } from "@/components/admin-shell";

export default function BillingPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold">Billing</h1>
      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm text-white/[0.62]">
        Stripe payments, subscription state, refunds, and manual credit grants live here.
      </div>
    </AdminShell>
  );
}
