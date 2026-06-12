import { CloudRain, CloudSun, Wind } from "lucide-react";
import type {
  CurrentWeatherDto,
  WeatherForecastDto,
} from "../../../services/api/apiTypes";
import { Skeleton } from "../../../shared/components/Skeleton";
import { DashboardCard } from "./DashboardCard";
import { EmptyCard } from "./EmptyCard";
import { ErrorCard } from "./ErrorCard";
import { MetricBox } from "./MetricBox";

type WeatherTabProps = {
  weather: CurrentWeatherDto | null;
  forecast: WeatherForecastDto | null;
  isLoading: boolean;
  isForecastLoading: boolean;
  error: string | null;
  forecastError: string | null;
};

export function WeatherTab({
  weather,
  forecast,
  isLoading,
  isForecastLoading,
  error,
  forecastError,
}: WeatherTabProps) {
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

      <ForecastSection
        forecast={forecast}
        isLoading={isForecastLoading}
        error={forecastError}
      />

      <DashboardCard
        icon={<CloudSun size={22} />}
        title="Retrieved At"
        subtitle={new Date(weather.retrievedAtUtc).toLocaleString()}
      />
    </>
  );
}

type ForecastSectionProps = {
  forecast: WeatherForecastDto | null;
  isLoading: boolean;
  error: string | null;
};

function ForecastSection({
  forecast,
  isLoading,
  error,
}: ForecastSectionProps) {
  if (isLoading) {
    return <ForecastSkeleton />;
  }

  if (error) {
    return <ErrorCard title="Forecast Error" message={error} />;
  }

  if (!forecast || forecast.dailyForecasts.length === 0) {
    return <EmptyCard message="No forecast data available." />;
  }

  return (
    <DashboardCard
      icon={<CloudRain size={22} />}
      title="5-Day Forecast"
      subtitle="Daily forecast fetched from Open-Meteo through your .NET API."
    >
      <div className="mt-4 space-y-3">
        {forecast.dailyForecasts.map((day) => (
          <div
            key={day.date}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-100">
                  {formatForecastDate(day.date)}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {day.condition}
                </p>
              </div>

              <div className="text-right">
                <p className="font-mono text-sm text-cyan-100">
                  {Math.round(day.temperatureMaxCelsius)}° /{" "}
                  {Math.round(day.temperatureMinCelsius)}°
                </p>

                <p className="mt-1 text-xs text-slate-500">max / min</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-white/10 bg-slate-950/30 p-2">
                <p className="text-xs text-slate-500">Rain Chance</p>
                <p className="mt-1 font-mono text-sm text-cyan-100">
                  {day.precipitationProbabilityMaxPercentage}%
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-slate-950/30 p-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Wind size={13} />
                  <span>Max Wind</span>
                </div>

                <p className="mt-1 font-mono text-sm text-cyan-100">
                  {Math.round(day.windSpeedMaxKmh)} km/h
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
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

function ForecastSkeleton() {
  return (
    <DashboardCard
      icon={<CloudRain size={22} />}
      title="Loading Forecast"
      subtitle="Fetching 5-day forecast from .NET API..."
    >
      <div className="mt-4 space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </DashboardCard>
  );
}

function formatForecastDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}