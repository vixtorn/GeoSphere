import { Database, Loader2, Trash2 } from "lucide-react";
import type { FavoriteLocationDto } from "../../../services/api/apiTypes";
import { Skeleton } from "../../../shared/components/Skeleton";
import { DashboardCard } from "./DashboardCard";
import { EmptyCard } from "./EmptyCard";
import { ErrorCard } from "./ErrorCard";

type SavedLocationsTabProps = {
  favoriteLocations: FavoriteLocationDto[];
  isLoading: boolean;
  error: string | null;
  deletingFavoriteId: string | null;
  onSelectFavoriteLocation: (location: FavoriteLocationDto) => void;
  onDeleteFavoriteLocation: (id: string) => void;
};

export function SavedLocationsTab({
  favoriteLocations,
  isLoading,
  error,
  deletingFavoriteId,
  onSelectFavoriteLocation,
  onDeleteFavoriteLocation,
}: SavedLocationsTabProps) {
  if (isLoading) {
    return <SavedLocationsSkeleton />;
  }

  if (error) {
    return <ErrorCard title="Saved Locations Error" message={error} />;
  }

  if (favoriteLocations.length === 0) {
    return (
      <EmptyCard message="No saved locations yet. Select a point on the globe and click Save." />
    );
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
                <button
  type="button"
  onClick={() => onSelectFavoriteLocation(location)}
  className="min-w-0 flex-1 text-left"
>
  <p className="font-medium text-slate-100 transition hover:text-cyan-100">
    {location.name}
  </p>

  <p className="mt-1 font-mono text-xs text-cyan-100">
    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
  </p>

  <p className="mt-1 text-xs text-slate-500">
    Click to navigate
  </p>
</button>

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