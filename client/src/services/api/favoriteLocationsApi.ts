import { getJson } from "./httpClient";
import type { FavoriteLocationDto } from "./apiTypes";

export type CreateFavoriteLocationRequest = {
  name: string;
  latitude: number;
  longitude: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined.");
}

export function getFavoriteLocations(
  signal?: AbortSignal
): Promise<FavoriteLocationDto[]> {
  return getJson<FavoriteLocationDto[]>("/api/favorite-locations", {
    signal,
  });
}

export async function createFavoriteLocation(
  request: CreateFavoriteLocationRequest,
  signal?: AbortSignal
): Promise<FavoriteLocationDto> {
  const response = await fetch(`${API_BASE_URL}/api/favorite-locations`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Request failed with status code ${response.status}`
    );
  }

  return response.json() as Promise<FavoriteLocationDto>;
}

export async function deleteFavoriteLocation(
  id: string,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/favorite-locations/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
      signal,
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Request failed with status code ${response.status}`
    );
  }
}