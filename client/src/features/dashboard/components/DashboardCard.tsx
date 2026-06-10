import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

type DashboardCardProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export function DashboardCard({
  icon,
  title,
  subtitle,
  children,
}: DashboardCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-2 text-cyan-200">
            {icon}
          </div>

          <h3 className="font-medium text-slate-100">{title}</h3>
        </div>

        <MoreHorizontal size={18} className="text-slate-500" />
      </div>

      <p className="text-sm leading-6 text-slate-400">{subtitle}</p>

      {children}
    </article>
  );
}