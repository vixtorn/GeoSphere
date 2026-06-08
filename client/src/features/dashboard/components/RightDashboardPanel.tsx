import {
  BookmarkPlus,
  CloudSun,
  Database,
  Loader2,
  MapPinned,
  MoreHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Coordinates } from "../../globe/types/coordinates";
import { DashboardTabs, type DashboardTab } from "./DashboardTabs";
import { Skeleton } from "../../../shared/components/Skeleton";
import { getCurrentWeather } from "../../../services/api/weatherApi";
import { getGeospatialLocation } from "../../../services/api/geospatialApi";
import {
  createFavoriteLocation,
  deleteFavoriteLocation,
  getFavoriteLocations,
} from "../../../services/api/favoriteLocationsApi";
import type {
  CurrentWeatherDto,
  FavoriteLocationDto,
  GeospatialLocationDto,
} from "../../../services/api/apiTypes";

type RightDashboardPanelProps = {
  coordinates: Coordinates;
  onClose: () => void;
};

export function RightDashboardPanel({
  coordinates,
  onClose,
}: RightDashboardPanelProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("weather");

  const [weather, setWeather] = useState<CurrentWeatherDto | null>(null);
  const [geospatial, setGeospatial] =
    useState<GeospatialLocationDto | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<
    FavoriteLocationDto[]
  >([]);

  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isGeospatialLoading, setIsGeospatialLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [deletingFavoriteId, setDeletingFavoriteId] = useState<string | null>(
    null
  );

  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [geospatialError, setGeospatialError] = useState<string | null>(null);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);
  const [saveFavoriteError, setSaveFavoriteError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      try {
        setIsWeatherLoading(true);
        setWeatherError(null);

        const data = await getCurrentWeather(coordinates, controller.signal);

        setWeather(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setWeatherError(
          error instanceof Error
            ? error.message
            : "Weather data could not be loaded."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsWeatherLoading(false);
        }
      }
    }

    loadWeather();

    return () => controller.abort();
  }, [coordinates]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadGeospatialData() {
      try {
        setIsGeospatialLoading(true);
        setGeospatialError(null);

        const data = await getGeospatialLocation(
          coordinates,
          controller.signal
        );

        setGeospatial(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setGeospatialError(
          error instanceof Error
            ? error.message
            : "Geospatial data could not be loaded."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsGeospatialLoading(false);
        }
      }
    }

    loadGeospatialData();

    return () => controller.abort();
  }, [coordinates]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFavoriteLocations() {
      try {
        setIsFavoritesLoading(true);
        setFavoritesError(null);

        const data = await getFavoriteLocations(controller.signal);

        setFavoriteLocations(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setFavoritesError(
          error instanceof Error
            ? error.message
            : "Favorite locations could not be loaded."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsFavoritesLoading(false);
        }
      }
    }

    loadFavoriteLocations();

    return () => controller.abort();
  }, []);

  const isCurrentLocationSaved = favoriteLocations.some(
    (location) =>
      location.latitude === coordinates.lat && location.longitude === coordinates.lng
  );

  async function handleSaveFavorite() {
    try {
      setIsSavingFavorite(true);
      setSaveFavoriteError(null);

      const locationName = buildFavoriteLocationName(coordinates, geospatial);

      const savedLocation = await createFavoriteLocation({
        name: locationName,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });

      setFavoriteLocations((currentLocations) => [
        savedLocation,
        ...currentLocations,
      ]);

      setActiveTab("saved");
    } catch (error) {
      setSaveFavoriteError(
        error instanceof Error
          ? error.message
          : "Favorite location could not be saved."
      );
    } finally {
      setIsSavingFavorite(false);
    }
  }

  async function handleDeleteFavoriteLocation(id: string) {
    try {
      setDeletingFavoriteId(id);
      setFavoritesError(null);

      await deleteFavoriteLocation(id);

      setFavoriteLocations((currentLocations) =>
        currentLocations.filter((location) => location.id !== id)
      );
    } catch (error) {
      setFavoritesError(
        error instanceof Error
          ? error.message
          : "Favorite location could not be deleted."
      );
    } finally {
      setDeletingFavoriteId(null);
    }
  }

  return (
    <section className="h-full overflow-y-auto rounded-2xl border border-cyan-300/15 bg-slate-950/55 p-5 text-slate-100 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
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

          {saveFavoriteError && (
            <p className="mt-2 max-w-[360px] text-xs text-red-200/80">
              {saveFavoriteError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveFavorite}
            disabled={isSavingFavorite || isCurrentLocationSaved}
            className="inline-flex items-center gap-2 rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs font-medium text-amber-100 transition hover:border-amber-300/40 hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingFavorite ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <BookmarkPlus size={16} />
            )}
            {isCurrentLocationSaved ? "Saved" : "Save"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-slate-400 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-100"
            aria-label="Close dashboard panel"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-4">
        {activeTab === "weather" && (
          <WeatherTab
            weather={weather}
            isLoading={isWeatherLoading}
            error={weatherError}
          />
        )}

        {activeTab === "geo" && (
          <GeospatialTab
            geospatial={geospatial}
            isLoading={isGeospatialLoading}
            error={geospatialError}
          />
        )}

        {activeTab === "saved" && (
          <SavedLocationsTab
            favoriteLocations={favoriteLocations}
            isLoading={isFavoritesLoading}
            error={favoritesError}
            deletingFavoriteId={deletingFavoriteId}
            onDeleteFavoriteLocation={handleDeleteFavoriteLocation}
          />
        )}
      </div>
    </section>
  );
}

type WeatherTabProps = {
  weather: CurrentWeatherDto | null;
  isLoading: boolean;
  error: string | null;
};

function WeatherTab({ weather, isLoading, error }: WeatherTabProps) {
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

type GeospatialTabProps = {
  geospatial: GeospatialLocationDto | null;
  isLoading: boolean;
  error: string | null;
};

function GeospatialTab({
  geospatial,
  isLoading,
  error,
}: GeospatialTabProps) {
  if (isLoading) {
    return <GeospatialSkeleton />;
  }

  if (error) {
    return <ErrorCard title="Geospatial Error" message={error} />;
  }

  if (!geospatial) {
    return <EmptyCard message="No geospatial data available." />;
  }

  return (
    <>
      <DashboardCard
        icon={<MapPinned size={22} />}
        title="Location"
        subtitle={`${geospatial.city}, ${geospatial.country}`}
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoBox label="Latitude" value={geospatial.latitude.toFixed(5)} />
          <InfoBox label="Longitude" value={geospatial.longitude.toFixed(5)} />
          <InfoBox label="Region" value={geospatial.region} />
          <InfoBox
            label="Elevation"
            value={`${geospatial.elevationMeters} m`}
          />
        </div>
      </DashboardCard>

      <DashboardCard
        icon={<MapPinned size={22} />}
        title="Terrain"
        subtitle="Geospatial classification based on elevation and settlement data."
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoBox label="Terrain" value={geospatial.terrainType} />
          <InfoBox label="Settlement" value={geospatial.settlementType} />
        </div>
      </DashboardCard>
    </>
  );
}

type SavedLocationsTabProps = {
  favoriteLocations: FavoriteLocationDto[];
  isLoading: boolean;
  error: string | null;
  deletingFavoriteId: string | null;
  onDeleteFavoriteLocation: (id: string) => void;
};

function SavedLocationsTab({
  favoriteLocations,
  isLoading,
  error,
  deletingFavoriteId,
  onDeleteFavoriteLocation,
}: SavedLocationsTabProps) {
  if (isLoading) {
    return <SavedLocationsSkeleton />;
  }

  if (error) {
    return <ErrorCard title="Saved Locations Error" message={error} />;
  }

  if (favoriteLocations.length === 0) {
    return <EmptyCard message="No saved locations yet. Select a point on the globe and click Save." />;
  }

  return (
    <DashboardCard
      icon={<Database size={22} />}
      title="Saved Locations"
      subtitle="Fetched from your SQLite database through the .NET API."
    >
      <div className="mt-4 space-y-3">
        {favoriteLocations.map((location) => {
          const isDeleting = deletingFavoriteId === location.id;

          return (
            <div
              key={location.id}
              className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-100">
                    {location.name}
                  </p>

                  <p className="mt-1 font-mono text-xs text-cyan-100">
                    {location.latitude.toFixed(4)},{" "}
                    {location.longitude.toFixed(4)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteFavoriteLocation(location.id)}
                  disabled={isDeleting}
                  className="rounded-lg border border-red-400/20 bg-red-400/10 p-2 text-red-200 transition hover:border-red-300/40 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Delete ${location.name}`}
                >
                  {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Created: {new Date(location.createdAtUtc).toLocaleDateString()}
              </p>
            </div>
          );
        })}
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

type MetricBoxProps = {
  label: string;
  value: string;
};

function MetricBox({ label, value }: MetricBoxProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-sm text-cyan-100">{value}</p>
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

function GeospatialSkeleton() {
  return (
    <DashboardCard
      icon={<MapPinned size={22} />}
      title="Loading Geospatial Data"
      subtitle="Fetching location data from .NET API..."
    >
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </DashboardCard>
  );
}

function SavedLocationsSkeleton() {
  return (
    <DashboardCard
      icon={<Database size={22} />}
      title="Loading Saved Locations"
      subtitle="Fetching saved locations from .NET API..."
    >
      <div className="mt-4 space-y-3">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    </DashboardCard>
  );
}

type ErrorCardProps = {
  title: string;
  message: string;
};

function ErrorCard({ title, message }: ErrorCardProps) {
  return (
    <article className="rounded-xl border border-red-400/20 bg-red-950/20 p-4">
      <h3 className="font-medium text-red-200">{title}</h3>
      <p className="mt-2 text-sm text-red-100/70">{message}</p>
    </article>
  );
}

type EmptyCardProps = {
  message: string;
};

function EmptyCard({ message }: EmptyCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">
      {message}
    </article>
  );
}

function buildFavoriteLocationName(
  coordinates: Coordinates,
  geospatial: GeospatialLocationDto | null
) {
  if (geospatial && geospatial.city !== "Unknown Location") {
    return `${geospatial.city}, ${geospatial.country}`;
  }

  return `Location ${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(
    4
  )}`;
}