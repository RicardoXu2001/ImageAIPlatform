export function MetricCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <p className="text-sm text-white/[0.52]">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        {delta ? <p className="text-xs text-emerald-300">{delta}</p> : null}
      </div>
    </div>
  );
}
