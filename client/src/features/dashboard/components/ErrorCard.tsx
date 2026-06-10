type ErrorCardProps = {
  title: string;
  message: string;
};

export function ErrorCard({ title, message }: ErrorCardProps) {
  return (
    <article className="rounded-xl border border-red-400/20 bg-red-950/20 p-4">
      <h3 className="font-medium text-red-200">{title}</h3>
      <p className="mt-2 text-sm text-red-100/70">{message}</p>
    </article>
  );
}