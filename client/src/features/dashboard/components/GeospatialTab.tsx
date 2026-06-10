import { MapPinned } from "lucide-react";
import type { GeospatialLocationDto } from "../../../services/api/apiTypes";
import { Skeleton } from "../../../shared/components/Skeleton";
import { DashboardCard } from "./DashboardCard";
import { EmptyCard } from "./EmptyCard";
import { ErrorCard } from "./ErrorCard";
import { InfoBox } from "./InfoBox";

type GeospatialTabProps = {
  geospatial: GeospatialLocationDto | null;
  isLoading: boolean;
  error: string | null;
};

export function GeospatialTab({
  geospatial,
  isLoading,
  error,
}: GeospatialTabProps) {
  if (isLoading) {
    return <GeospatialSkeleton />;
  }

  if (error) {
    return <ErrorCard title="Geospatial Error" message={error} />;
  }

  if (!geospatial) {
    return <EmptyCard message="No geospatial data available." />;
  }

  return (
    <>
      <DashboardCard
        icon={<MapPinned size={22} />}
        title="Location"
        subtitle={`${geospatial.city}, ${geospatial.country}`}
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoBox label="Latitude" value={geospatial.latitude.toFixed(5)} />
          <InfoBox label="Longitude" value={geospatial.longitude.toFixed(5)} />
          <InfoBox label="Region" value={geospatial.region} />
          <InfoBox
            label="Elevation"
            value={`${geospatial.elevationMeters} m`}
          />
        </div>
      </DashboardCard>

      <DashboardCard
        icon={<MapPinned size={22} />}
        title="Terrain"
        subtitle="Geospatial classification based on elevation and settlement data."
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <InfoBox label="Terrain" value={geospatial.terrainType} />
          <InfoBox label="Settlement" value={geospatial.settlementType} />
        </div>
      </DashboardCard>
    </>
  );
}

function GeospatialSkeleton() {
  return (
    <DashboardCard
      icon={<MapPinned size={22} />}
      title="Loading Geospatial Data"
      subtitle="Fetching location data from .NET API..."
    >
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    </DashboardCard>
  );
}