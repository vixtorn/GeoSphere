import type { Coordinates } from "../../features/globe/types/coordinates";
import type {
  GeospatialLocationDto,
  GeospatialSearchResultDto,
} from "./apiTypes";
import { getJson } from "./httpClient";

export function getGeospatialLocation(
  coordinates: Coordinates,
  signal?: AbortSignal
): Promise<GeospatialLocationDto> {
  return getJson<GeospatialLocationDto>(
    `/api/geospatial/location?lat=${coordinates.lat}&lng=${coordinates.lng}`,
    { signal }
  );
}

export function searchGeospatialLocations(
  query: string,
  signal?: AbortSignal
): Promise<GeospatialSearchResultDto[]> {
  return getJson<GeospatialSearchResultDto[]>(
    `/api/geospatial/search?query=${encodeURIComponent(query)}`,
    { signal }
  );
}