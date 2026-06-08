import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import type { GlobeTheme } from "../types/globeTheme";

type DayNightToggleProps = {
  value: GlobeTheme;
  onChange: (value: GlobeTheme) => void;
};

export function DayNightToggle({ value, onChange }: DayNightToggleProps) {
  const isNight = value === "night";

  function handleToggle() {
    onChange(isNight ? "day" : "night");
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isNight ? "day" : "night"} mode`}
      className={[
        "relative flex h-8 w-16 items-center rounded-full border p-1 transition",
        isNight
          ? "border-cyan-300/20 bg-slate-900 shadow-inner shadow-cyan-950/60"
          : "border-amber-300/30 bg-sky-300/20 shadow-inner shadow-amber-300/20",
      ].join(" ")}
    >
      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
        }}
        className={[
          "grid h-6 w-6 place-items-center rounded-full shadow-lg",
          isNight
            ? "translate-x-8 bg-slate-800 text-cyan-100 shadow-cyan-400/20"
            : "translate-x-0 bg-amber-300 text-slate-950 shadow-amber-300/30",
        ].join(" ")}
      >
        {isNight ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>

      <span className="pointer-events-none absolute left-2 text-[10px] text-slate-950/50">
        {!isNight && ""}
      </span>

      <span className="pointer-events-none absolute right-2 text-[10px] text-cyan-100/50">
        {isNight && ""}
      </span>
    </button>
  );
}