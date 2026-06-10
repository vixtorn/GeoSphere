type EmptyCardProps = {
  message: string;
};

export function EmptyCard({ message }: EmptyCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">
      {message}
    </article>
  );
}