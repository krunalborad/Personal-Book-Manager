export default function StatCard({
  label,
  value,
  accent = "text-ivory",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-md border border-parchment/15 bg-ink-light/50 px-5 py-4">
      <p className={`font-display text-3xl font-medium ${accent}`}>{value}</p>
      <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-parchment/50">
        {label}
      </p>
    </div>
  );
}
