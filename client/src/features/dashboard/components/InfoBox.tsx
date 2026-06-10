type InfoBoxProps = {
  label: string;
  value: string;
};

export function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm text-cyan-100">{value}</p>
    </div>
  );
}