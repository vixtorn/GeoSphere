import { CloudSun, Database, MapPinned, MoreHorizontal } from "lucide-react";
import type { Coordinates } from "../../globe/types/coordinates";

type RightDashboardPanelProps = {
  coordinates: Coordinates;
};

export function RightDashboardPanel({ coordinates }: RightDashboardPanelProps) {
  return (
    <section className="h-full rounded-2xl border border-cyan-300/15 bg-slate-950/55 p-5 text-slate-100 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
      <header className="mb-5 border-l-4 border-amber-400 pl-4">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
          Location Data
        </p>

        <h2 className="mt-1 text-xl font-semibold">Selected Coordinate</h2>

        <p className="mt-1 text-sm text-slate-400">
          {coordinates.lat.toFixed(5)}° lat, {coordinates.lng.toFixed(5)}° lng
        </p>
      </header>

      <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        <button className="rounded-lg bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
          Weather
        </button>

        <button className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
          Geo Data
        </button>

        <button className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5">
          Saved
        </button>
      </div>

      <div className="space-y-4">
        <DashboardCard
          icon={<CloudSun size={22} />}
          title="Current Weather"
          subtitle="Weather API connection will come later."
        />

        <DashboardCard
          icon={<MapPinned size={22} />}
          title="Geospatial Data"
          subtitle="Elevation and reverse geocoding will be connected later."
        />

        <DashboardCard
          icon={<Database size={22} />}
          title="Saved Locations"
          subtitle=".NET backend and database integration will come after the UI flow."
        />
      </div>
    </section>
  );
}

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
};

function DashboardCard({ icon, title, subtitle }: DashboardCardProps) {
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
    </article>
  );
}