import type { Coordinates } from "../../features/globe/types/coordinates";
import { getJson } from "./httpClient";
import type { GeospatialLocationDto } from "./apiTypes";

export function getGeospatialLocation(
  coordinates: Coordinates,
  signal?: AbortSignal
): Promise<GeospatialLocationDto> {
  const query = new URLSearchParams({
    lat: coordinates.lat.toString(),
    lng: coordinates.lng.toString(),
  });

  return getJson<GeospatialLocationDto>(
    `/api/geospatial/location?${query.toString()}`,
    { signal }
  );
}