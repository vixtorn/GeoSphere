const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined.");
}

type RequestOptions = {
  signal?: AbortSignal;
};

export async function getJson<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal: options.signal,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Request failed with status code ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}