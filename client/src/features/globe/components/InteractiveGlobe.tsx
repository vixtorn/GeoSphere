import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { Coordinates } from "../types/coordinates";
import type { GlobeTheme } from "../types/globeTheme";

const MIN_CAMERA_DISTANCE = 110;
const MAX_CAMERA_DISTANCE = 900;

type GlobeMarker = Coordinates & {
  id: string;
  label: string;
};

type InteractiveGlobeProps = {
  selectedCoordinates: Coordinates | null;
  isDataMode: boolean;
  globeTheme: GlobeTheme;
  onCoordinateSelect: (coordinates: Coordinates) => void;
};

export function InteractiveGlobe({
  selectedCoordinates,
  isDataMode,
  globeTheme,
  onCoordinateSelect,
}: InteractiveGlobeProps) {
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState({
    width: 900,
    height: 700,
  });

  const globeImageUrl =
    globeTheme === "day"
      ? "/textures/earth-day-8k.jpg"
      : "/textures/earth-night-8k.jpg";

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      setSize({
        width: Math.max(width, 320),
        height: Math.max(height, 320),
      });
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();

    controls.autoRotate = !isDataMode;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;

    controls.minDistance = MIN_CAMERA_DISTANCE;
    controls.maxDistance = MAX_CAMERA_DISTANCE;
  }, [isDataMode]);

  useEffect(() => {
    if (!globeRef.current || !selectedCoordinates) return;

    globeRef.current.pointOfView(
      {
        lat: selectedCoordinates.lat,
        lng: selectedCoordinates.lng,
        altitude: 0.8,
      },
      1000
    );
  }, [selectedCoordinates]);

  const markerData: GlobeMarker[] = useMemo(() => {
    if (!selectedCoordinates) return [];

    return [
      {
        id: "selected-location",
        lat: selectedCoordinates.lat,
        lng: selectedCoordinates.lng,
        label: `${selectedCoordinates.lat.toFixed(4)}, ${selectedCoordinates.lng.toFixed(4)}`,
      },
    ];
  }, [selectedCoordinates]);

  function handleGlobeClick(point: Coordinates) {
    const coordinates: Coordinates = {
      lat: Number(point.lat.toFixed(5)),
      lng: Number(point.lng.toFixed(5)),
    };

    onCoordinateSelect(coordinates);
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={globeImageUrl}
        showAtmosphere
        atmosphereColor="#67e8f9"
        atmosphereAltitude={0.18}
        showGraticules
        onGlobeClick={handleGlobeClick}
        pointsData={markerData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.04}
        pointRadius={0.35}
        pointColor={() => "#f59e0b"}
        pointLabel="label"
        ringsData={markerData}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => "rgba(245, 158, 11, 0.75)"}
        ringMaxRadius={5}
        ringPropagationSpeed={2}
        ringRepeatPeriod={900}
      />

      <div className="pointer-events-none absolute inset-0 rounded-full bg-cyan-300/5 blur-3xl" />
    </div>
  );
}