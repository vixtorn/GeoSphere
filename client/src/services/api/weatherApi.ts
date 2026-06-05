import type { Coordinates } from "../../features/globe/types/coordinates";
import { getJson } from "./httpClient";
import type { CurrentWeatherDto } from "./apiTypes";

export function getCurrentWeather(
  coordinates: Coordinates,
  signal?: AbortSignal
): Promise<CurrentWeatherDto> {
  const query = new URLSearchParams({
    lat: coordinates.lat.toString(),
    lng: coordinates.lng.toString(),
  });

  return getJson<CurrentWeatherDto>(
    `/api/weather/current?${query.toString()}`,
    { signal }
  );
}