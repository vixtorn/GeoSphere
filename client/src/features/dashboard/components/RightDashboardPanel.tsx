import {
  CloudSun,
  Database,
  MapPinned,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Coordinates } from "../../globe/types/coordinates";
import { DashboardTabs, type DashboardTab } from "./DashboardTabs";
import { Skeleton } from "../../../shared/components/Skeleton";

type RightDashboardPanelProps = {
  coordinates: Coordinates;
  onClose: () => void;
};

export function RightDashboardPanel({
  coordinates,
  onClose,
}: RightDashboardPanelProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("weather");

  return (
    <section className="h-full rounded-2xl border border-cyan-300/15 bg-slate-950/55 p-5 text-slate-100 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
      <header className="mb-5 flex items-start justify-between gap-4 border-l-4 border-amber-400 pl-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
            Location Data
          </p>

          <h2 className="mt-1 text-xl font-semibold">Selected Coordinate</h2>

          <p className="mt-1 text-sm text-slate-400">
            {coordinates.lat.toFixed(5)}° lat,{" "}
            {coordinates.lng.toFixed(5)}° lng
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-slate-400 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
          aria-label="Close dashboard panel"
        >
          <X size={18} />
        </button>
      </header>

      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-4">
        {activeTab === "weather" && <WeatherTab />}

        {activeTab === "geo" && <GeospatialTab coordinates={coordinates} />}

        {activeTab === "saved" && <SavedLocationsTab />}
      </div>
    </section>
  );
}

function WeatherTab() {
  return (
    <>
      <DashboardCard
        icon={<CloudSun size={22} />}
        title="Current Weather"
        subtitle="Weather API connection will come later."
      >
        <div className="mt-4 grid grid-cols-4 gap-3">
          <MetricSkeleton label="Temp" />
          <MetricSkeleton label="Humidity" />
          <MetricSkeleton label="Wind" />
          <MetricSkeleton label="Pressure" />
        </div>
      </DashboardCard>

      <DashboardCard
        icon={<CloudSun size={22} />}
        title="Forecast Preview"
        subtitle="5-day forecast skeleton placeholder."
      >
        <div className="mt-4 space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-10/12" />
          <Skeleton className="h-3 w-8/12" />
        </div>
      </DashboardCard>
    </>
  );
}

type GeospatialTabProps = {
  coordinates: Coordinates;
};

function GeospatialTab({ coordinates }: GeospatialTabProps) {
  return (
    <>
      <DashboardCard
        icon={<MapPinned size={22} />}
        title="Coordinate Details"
        subtitle="Raw coordinate information captured from the globe."
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoBox label="Latitude" value={coordinates.lat.toFixed(5)} />
          <InfoBox label="Longitude" value={coordinates.lng.toFixed(5)} />
        </div>
      </DashboardCard>

      <DashboardCard
        icon={<MapPinned size={22} />}
        title="Elevation & Reverse Geocoding"
        subtitle="Elevation, country and city data will be connected through the backend."
      >
        <div className="mt-4 space-y-3">
          <Skeleton className="h-3 w-9/12" />
          <Skeleton className="h-3 w-7/12" />
        </div>
      </DashboardCard>
    </>
  );
}

function SavedLocationsTab() {
  return (
    <DashboardCard
      icon={<Database size={22} />}
      title="Saved Locations"
      subtitle=".NET backend and database integration will come after the UI flow."
    >
      <div className="mt-4 rounded-lg border border-dashed border-cyan-300/20 bg-cyan-300/[0.03] p-4 text-sm text-slate-400">
        No saved locations yet. Later this tab will fetch favorite locations
        from the .NET API.
      </div>
    </DashboardCard>
  );
}

type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
};

function DashboardCard({
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

type MetricSkeletonProps = {
  label: string;
};

function MetricSkeleton({ label }: MetricSkeletonProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="mb-2 text-xs text-slate-500">{label}</p>
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

type InfoBoxProps = {
  label: string;
  value: string;
};

function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-mono text-sm text-cyan-100">{value}</p>
    </div>
  );
}