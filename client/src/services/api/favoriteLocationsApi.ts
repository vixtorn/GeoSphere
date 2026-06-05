import { getJson } from "./httpClient";
import type { FavoriteLocationDto } from "./apiTypes";

export function getFavoriteLocations(
  signal?: AbortSignal
): Promise<FavoriteLocationDto[]> {
  return getJson<FavoriteLocationDto[]>("/api/favorite-locations", {
    signal,
  });
}