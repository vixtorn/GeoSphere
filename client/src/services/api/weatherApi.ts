import type { Coordinates } from "../../features/globe/types/coordinates";
import type {
  CurrentWeatherDto,
  WeatherForecastDto,
} from "./apiTypes";
import { getJson } from "./httpClient";

export function getCurrentWeather(
  coordinates: Coordinates,
  signal?: AbortSignal
): Promise<CurrentWeatherDto> {
  return getJson<CurrentWeatherDto>(
    `/api/weather/current?lat=${coordinates.lat}&lng=${coordinates.lng}`,
    { signal }
  );
}

export function getWeatherForecast(
  coordinates: Coordinates,
  signal?: AbortSignal
): Promise<WeatherForecastDto> {
  return getJson<WeatherForecastDto>(
    `/api/weather/forecast?lat=${coordinates.lat}&lng=${coordinates.lng}`,
    { signal }
  );
}