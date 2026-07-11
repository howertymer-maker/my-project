"use client";

import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

export type TabKey = "profile" | "habits" | "missions" | "community";

const TABS: {
  key: TabKey;
  label: string;
  icon: string;
  accent: string;
}[] = [
  { key: "profile", label: "Профиль", icon: "person", accent: "#00f2ff" },
  { key: "habits", label: "Привычки", icon: "check_circle", accent: "#b6f700" },
  { key: "missions", label: "Миссии", icon: "rocket_launch", accent: "#e9b3ff" },
  { key: "community", label: "Сообщество", icon: "group", accent: "#00f2ff" },
];

export function BottomNav({
  tab,
  onChange,
}: {
  tab: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0e0e0f]/90 border-t border-outline-variant/30 rounded-t-xl shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-[640px] mx-auto flex justify-around items-center px-3 pt-2.5 pb-[max(14px,env(safe-area-inset-bottom))]">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 active:scale-90",
                active ? "scale-110" : "opacity-55 hover:opacity-90"
              )}
              style={
                active
                  ? {
                      color: t.accent,
                      filter: `drop-shadow(0 0 8px ${t.accent}99)`,
                    }
                  : { color: "#b9cacb" }
              }
              aria-current={active ? "page" : undefined}
            >
              <MaterialIcon name={t.icon} size={24} fill={active} weight={active ? 600 : 400} />
              <span className="font-display text-[11px] font-bold tracking-[0.06em]">
                {t.label}
              </span>
              {active && (
                <span
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-full"
                  style={{ background: t.accent, boxShadow: `0 0 10px ${t.accent}` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
