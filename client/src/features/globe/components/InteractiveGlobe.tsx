import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { Coordinates } from "../types/coordinates";

type GlobeMarker = Coordinates & {
  id: string;
  label: string;
};

type InteractiveGlobeProps = {
  selectedCoordinates: Coordinates | null;
  isDataMode: boolean;
  onCoordinateSelect: (coordinates: Coordinates) => void;
};

export function InteractiveGlobe({
  selectedCoordinates,
  isDataMode,
  onCoordinateSelect,
}: InteractiveGlobeProps) {
  const globeRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState({
    width: 900,
    height: 700,
  });

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

controls.minDistance = 110;
controls.maxDistance = 900;
  }, [isDataMode]);

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

    globeRef.current?.pointOfView(
      {
        lat: coordinates.lat,
        lng: coordinates.lng,
        altitude: 1.7,
      },
      1000
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
  <Globe
  ref={globeRef}
  width={size.width}
  height={size.height}
  backgroundColor="rgba(0,0,0,0)"
  globeImageUrl="/textures/earth-day-8k.jpg"
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