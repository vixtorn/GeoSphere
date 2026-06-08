import type { GlobeTheme } from "../types/globeTheme";
import "./DayNightToggle.css";

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
      className="day-night-toggle"
      data-time={value}
      onClick={handleToggle}
      aria-label={`Switch to ${isNight ? "day" : "night"} globe texture`}
      title={`Switch to ${isNight ? "day" : "night"} mode`}
    >
      <span className="day-night-toggle__clouds" />
      <span className="day-night-toggle__stars">
        <span />
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="day-night-toggle__orb">
        <span className="day-night-toggle__crater day-night-toggle__crater--one" />
        <span className="day-night-toggle__crater day-night-toggle__crater--two" />
        <span className="day-night-toggle__crater day-night-toggle__crater--three" />
      </span>
    </button>
  );
}