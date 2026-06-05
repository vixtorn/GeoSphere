type DashboardTab = "weather" | "geo" | "saved";

type DashboardTabsProps = {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
};

const tabs: Array<{
  id: DashboardTab;
  label: string;
}> = [
  {
    id: "weather",
    label: "Weather",
  },
  {
    id: "geo",
    label: "Geo Data",
  },
  {
    id: "saved",
    label: "Saved",
  },
];

export function DashboardTabs({
  activeTab,
  onTabChange,
}: DashboardTabsProps) {
  return (
    <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={
              isActive
                ? "rounded-lg bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100 shadow-inner shadow-cyan-950/40"
                : "rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export type { DashboardTab };