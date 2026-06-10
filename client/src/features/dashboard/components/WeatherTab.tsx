import { CloudSun } from "lucide-react";
import type { CurrentWeatherDto } from "../../../services/api/apiTypes";
import { Skeleton } from "../../../shared/components/Skeleton";
import { DashboardCard } from "./DashboardCard";
import { EmptyCard } from "./EmptyCard";
import { ErrorCard } from "./ErrorCard";
import { MetricBox } from "./MetricBox";

type WeatherTabProps = {
  weather: CurrentWeatherDto | null;
  isLoading: boolean;
  error: string | null;
};

export function WeatherTab({ weather, isLoading, error }: WeatherTabProps) {
  if (isLoading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return <ErrorCard title="Weather Error" message={error} />;
  }

  if (!weather) {
    return <EmptyCard message="No weather data available." />;
  }

  return (
    <>
      <DashboardCard
        icon={<CloudSun size={22} />}
        title="Current Weather"
        subtitle={weather.condition}
      >
        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <MetricBox label="Temp" value={`${weather.temperatureCelsius}°C`} />
          <MetricBox label="Feels" value={`${weather.feelsLikeCelsius}°C`} />
          <MetricBox
            label="Humidity"
            value={`${weather.humidityPercentage}%`}
          />
          <MetricBox label="Wind" value={`${weather.windSpeedKmh} km/h`} />
        </div>

        <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Pressure
          </p>
          <p className="mt-2 font-mono text-sm text-cyan-100">
            {weather.pressureHPa} hPa
          </p>
        </div>
      </DashboardCard>

      <DashboardCard
        icon={<CloudSun size={22} />}
        title="Retrieved At"
        subtitle={new Date(weather.retrievedAtUtc).toLocaleString()}
      />
    </>
  );
}

function WeatherSkeleton() {
  return (
    <DashboardCard
      icon={<CloudSun size={22} />}
      title="Loading Weather"
      subtitle="Fetching weather data from .NET API..."
    >
      <div className="mt-4 grid grid-cols-4 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </DashboardCard>
  );
}