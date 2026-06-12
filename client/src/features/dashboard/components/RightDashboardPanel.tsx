import { BookmarkPlus, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  CurrentWeatherDto,
  FavoriteLocationDto,
  GeospatialLocationDto,
  WeatherForecastDto,
} from "../../../services/api/apiTypes";
import {
  createFavoriteLocation,
  deleteFavoriteLocation,
  getFavoriteLocations,
} from "../../../services/api/favoriteLocationsApi";
import { getGeospatialLocation } from "../../../services/api/geospatialApi";
import {
  getCurrentWeather,
  getWeatherForecast,
} from "../../../services/api/weatherApi";
import type { Coordinates } from "../../globe/types/coordinates";
import { DashboardTabs, type DashboardTab } from "./DashboardTabs";
import { GeospatialTab } from "./GeospatialTab";
import { SavedLocationsTab } from "./SavedLocationsTab";
import { WeatherTab } from "./WeatherTab";

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
  const [forecast, setForecast] = useState<WeatherForecastDto | null>(null);
  const [geospatial, setGeospatial] =
    useState<GeospatialLocationDto | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<
    FavoriteLocationDto[]
  >([]);

  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isGeospatialLoading, setIsGeospatialLoading] = useState(false);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [deletingFavoriteId, setDeletingFavoriteId] = useState<string | null>(
    null
  );

  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [forecastError, setForecastError] = useState<string | null>(null);
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

    async function loadForecast() {
      try {
        setIsForecastLoading(true);
        setForecastError(null);

        const data = await getWeatherForecast(coordinates, controller.signal);

        setForecast(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setForecastError(
          error instanceof Error
            ? error.message
            : "Forecast data could not be loaded."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsForecastLoading(false);
        }
      }
    }

    loadForecast();

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
      location.latitude === coordinates.lat &&
      location.longitude === coordinates.lng
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
            forecast={forecast}
            isLoading={isWeatherLoading}
            isForecastLoading={isForecastLoading}
            error={weatherError}
            forecastError={forecastError}
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