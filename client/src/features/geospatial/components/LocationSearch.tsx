import { Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GeospatialSearchResultDto } from "../../../services/api/apiTypes";
import { searchGeospatialLocations } from "../../../services/api/geospatialApi";
import type { Coordinates } from "../../globe/types/coordinates";

type LocationSearchProps = {
  onLocationSelect: (coordinates: Coordinates) => void;
};

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeospatialSearchResultDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);
        setIsDropdownOpen(true);

        const data = await searchGeospatialLocations(
          normalizedQuery,
          controller.signal
        );

        setResults(data);
      } catch (searchError) {
        if (controller.signal.aborted) return;

        setResults([]);
        setError(
          searchError instanceof Error
            ? searchError.message
            : "Location search failed."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  function handleSelectLocation(result: GeospatialSearchResultDto) {
    onLocationSelect({
      lat: Number(result.latitude.toFixed(5)),
      lng: Number(result.longitude.toFixed(5)),
    });

    setQuery(result.name);
    setIsDropdownOpen(false);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setError(null);
    setIsDropdownOpen(false);
  }

  const normalizedQuery = query.trim();

  const shouldShowDropdown =
    isDropdownOpen && normalizedQuery.length >= 2;

  return (
    <div ref={containerRef} className="relative hidden w-[360px] md:block">
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-300 transition focus-within:border-cyan-300/40 focus-within:bg-white/[0.07]">
        <Search size={16} className="text-slate-400" />

        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => {
            if (normalizedQuery.length >= 2) {
              setIsDropdownOpen(true);
            }
          }}
          placeholder="Search Location..."
          className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />

        {isLoading && (
          <Loader2 size={16} className="animate-spin text-cyan-200" />
        )}

        {!isLoading && query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-slate-200"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {shouldShowDropdown && (
        <div className="absolute left-0 right-0 top-12 z-[9999] overflow-hidden rounded-xl border border-cyan-300/15 bg-slate-950/95 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          {isLoading && (
            <div className="flex items-center gap-2 p-3 text-sm text-cyan-100">
              <Loader2 size={15} className="animate-spin" />
              <span>Searching locations...</span>
            </div>
          )}

          {!isLoading && error && (
            <div className="p-3 text-sm text-red-200/80">{error}</div>
          )}

          {!isLoading &&
            !error &&
            results.map((result) => (
              <button
                key={`${result.latitude}-${result.longitude}-${result.name}`}
                type="button"
                onClick={() => handleSelectLocation(result)}
                className="flex w-full items-start gap-3 border-b border-white/5 px-3 py-3 text-left transition last:border-b-0 hover:bg-cyan-300/10"
              >
                <div className="mt-0.5 rounded-lg border border-cyan-300/15 bg-cyan-300/10 p-2 text-cyan-200">
                  <MapPin size={15} />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {result.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {result.region} · {result.latitude.toFixed(4)},{" "}
                    {result.longitude.toFixed(4)}
                  </p>
                </div>
              </button>
            ))}

          {!isLoading && !error && results.length === 0 && (
            <div className="p-3 text-sm text-slate-400">
              No locations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}