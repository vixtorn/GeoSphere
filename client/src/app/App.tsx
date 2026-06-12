import { AnimatePresence, motion } from "framer-motion";
import { UserCircle2 } from "lucide-react";
import { useState } from "react";
import { RightDashboardPanel } from "../features/dashboard/components/RightDashboardPanel";
import { LocationSearch } from "../features/geospatial/components/LocationSearch";
import { DayNightToggle } from "../features/globe/components/DayNightToggle";
import { InteractiveGlobe } from "../features/globe/components/InteractiveGlobe";
import type { Coordinates } from "../features/globe/types/coordinates";
import type { GlobeTheme } from "../features/globe/types/globeTheme";

export default function App() {
  const [selectedCoordinates, setSelectedCoordinates] =
    useState<Coordinates | null>(null);

  const [globeTheme, setGlobeTheme] = useState<GlobeTheme>("day");

  const isDataMode = selectedCoordinates !== null;

  return (
    <div className="min-h-screen overflow-hidden bg-[#020617] text-slate-100">
      <TopNavigation
        globeTheme={globeTheme}
        onGlobeThemeChange={setGlobeTheme}
        onLocationSelect={setSelectedCoordinates}
      />

      <main className="relative h-[calc(100vh-56px)] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(8,145,178,0.20),transparent_42%),linear-gradient(180deg,#020617,#030712)]">
        <motion.section
          className="absolute inset-y-0 left-0 flex items-center justify-center"
          animate={{
            width: isDataMode ? "60%" : "100%",
          }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 18,
          }}
        >
          <motion.div
            className="relative h-[88%] w-[88%]"
            animate={{
              scale: isDataMode ? 0.94 : 1,
              x: isDataMode ? -16 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 18,
            }}
          >
            {!isDataMode && (
              <motion.div
                className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 text-center"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-full border border-cyan-300/15 bg-slate-950/40 px-5 py-2 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/80">
                    Click a location on the globe to discover geospatial data
                  </p>
                </div>
              </motion.div>
            )}

            <InteractiveGlobe
              selectedCoordinates={selectedCoordinates}
              isDataMode={isDataMode}
              globeTheme={globeTheme}
              onCoordinateSelect={setSelectedCoordinates}
            />
          </motion.div>
        </motion.section>

        <AnimatePresence>
          {selectedCoordinates && (
            <motion.aside
              className="absolute bottom-6 right-6 top-6 w-[38vw] min-w-[420px] max-w-[560px]"
              initial={{ opacity: 0, x: 80, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 80, filter: "blur(8px)" }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 20,
              }}
            >
              <RightDashboardPanel
  coordinates={selectedCoordinates}
  onLocationSelect={setSelectedCoordinates}
  onClose={() => setSelectedCoordinates(null)}
/>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

type TopNavigationProps = {
  globeTheme: GlobeTheme;
  onGlobeThemeChange: (value: GlobeTheme) => void;
  onLocationSelect: (coordinates: Coordinates) => void;
};

function TopNavigation({
  globeTheme,
  onGlobeThemeChange,
  onLocationSelect,
}: TopNavigationProps) {
  return (
    <header className="relative z-50 flex h-14 items-center justify-between border-b border-cyan-300/10 bg-slate-950/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
          🌐
        </div>

        <span className="font-semibold tracking-wide">GEOSPHERE WEATHER</span>
      </div>

      <LocationSearch onLocationSelect={onLocationSelect} />

      <div className="flex items-center gap-5 text-sm text-slate-300">
        <DayNightToggle value={globeTheme} onChange={onGlobeThemeChange} />
        <button className="hover:text-cyan-100">About</button>
        <UserCircle2 size={24} />
      </div>
    </header>
  );
}