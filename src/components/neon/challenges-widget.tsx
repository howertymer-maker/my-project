"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/mission-templates";

type Challenge = {
  id: string;
  category: string;
  title: string;
  points: number;
  completed: boolean;
  date?: string;
  weekStart?: string;
};

type ChallengesData = {
  daily: Challenge;
  weekly: Challenge;
};

/** Daily & Weekly challenge widget (Proposal 8). Shown on the missions screen. */
export function ChallengesWidget() {
  const { data, loading, refetch } = useApi<ChallengesData>("/api/challenges");
  const [busyDaily, setBusyDaily] = useState(false);
  const [busyWeekly, setBusyWeekly] = useState(false);

  if (loading || !data) return null;

  const complete = async (type: "daily" | "weekly", id: string, setter: (b: boolean) => void) => {
    setter(true);
    try {
      await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });
      refetch();
      // also refresh missions/profile
      window.dispatchEvent(new CustomEvent("neon-refresh"));
    } finally {
      setter(false);
    }
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <MaterialIcon name="flag" size={16} className="text-primary-fixed-dim" fill />
        <h3 className="font-display text-base font-bold text-on-surface">
          Челленджи
        </h3>
      </div>

      {/* Daily */}
      <ChallengeCard
        type="daily"
        challenge={data.daily}
        busy={busyDaily}
        onComplete={() => complete("daily", data.daily.id, setBusyDaily)}
      />

      {/* Weekly */}
      <ChallengeCard
        type="weekly"
        challenge={data.weekly}
        busy={busyWeekly}
        onComplete={() => complete("weekly", data.weekly.id, setBusyWeekly)}
      />
    </section>
  );
}

function ChallengeCard({
  type,
  challenge,
  busy,
  onComplete,
}: {
  type: "daily" | "weekly";
  challenge: Challenge;
  busy: boolean;
  onComplete: () => void;
}) {
  const cat = CATEGORY_META[challenge.category as keyof typeof CATEGORY_META];
  const color = cat?.color ?? "#00f2ff";
  const isDaily = type === "daily";

  return (
    <div
      className={cn(
        "rounded-xl p-3 flex items-center gap-3 border transition-all",
        challenge.completed && "opacity-70"
      )}
      style={{
        background: challenge.completed
          ? "rgba(22,22,24,0.5)"
          : isDaily
            ? "rgba(0,242,255,0.06)"
            : "rgba(233,179,255,0.06)",
        borderColor: challenge.completed
          ? "rgba(182,247,0,0.30)"
          : isDaily
            ? "rgba(0,242,255,0.25)"
            : "rgba(233,179,255,0.25)",
      }}
    >
      <div
        className="shrink-0 w-9 h-9 rounded-lg grid place-items-center border"
        style={{
          background: `${color}1a`,
          borderColor: `${color}55`,
          color,
        }}
      >
        <MaterialIcon name={isDaily ? "today" : "date_range"} size={18} fill />
      </div>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider"
            style={{ color, background: `${color}1a` }}
          >
            {isDaily ? "Ежедневный" : "Еженедельный"}
          </span>
          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
            → {cat?.skill ?? challenge.category}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-[11px] leading-snug",
            challenge.completed ? "text-on-surface-variant line-through" : "text-on-surface"
          )}
        >
          {challenge.title}
        </span>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span
          className="font-display text-sm font-bold"
          style={{ color: challenge.completed ? "#b6f700" : color }}
        >
          +{challenge.points}
        </span>
        {challenge.completed ? (
          <span className="flex items-center gap-0.5 font-mono text-[9px] text-secondary-fixed uppercase tracking-wider">
            <MaterialIcon name="check_circle" size={11} fill />
            Готово
          </span>
        ) : (
          <button
            onClick={onComplete}
            disabled={busy}
            className="font-display text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border active:scale-95 transition-transform disabled:opacity-50"
            style={{
              color,
              borderColor: `${color}66`,
              background: `${color}12`,
            }}
          >
            {busy ? "..." : "Выполнить"}
          </button>
        )}
      </div>
    </div>
  );
}
