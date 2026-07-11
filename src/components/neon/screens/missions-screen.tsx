"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";
import type { MissionTemplate } from "@/lib/mission-templates";
import { MissionCard } from "@/components/neon/mission-card";

type MissionState = {
  userMissionId: string | null;
  started: boolean;
  currentStage: number;
  stageStartedAt: string | null;
  stageReady: boolean;
  completedAt: string | null;
  pointsEarned: number;
  cooldownUntil: string | null;
  cooldownActive: boolean;
  premiumLocked: boolean;
};

type MissionView = {
  template: MissionTemplate;
  state: MissionState;
};

type MissionsData = {
  free: MissionView[];
  premium: MissionView[];
  premiumUser: boolean;
  stats: { completed: number; total: number; inProgress: number };
};

export function MissionsScreen() {
  const { data, loading, refetch } = useApi<MissionsData>("/api/missions");
  const [tab, setTab] = useState<"active" | "premium">("active");

  if (loading || !data) {
    return <MissionsSkeleton />;
  }

  const list = tab === "active" ? data.free : data.premium;

  return (
    <div className="flex flex-col gap-4 pt-4">
      {/* Header */}
      <section className="glass-panel rounded-xl p-5 flex flex-col gap-2 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #e9b3ff, transparent 70%)" }}
        />
        <div className="flex items-center gap-2 relative">
          <span className="text-tertiary-fixed-dim">
            <MaterialIcon name="rocket_launch" size={26} fill />
          </span>
          <h1 className="font-display text-2xl font-extrabold text-on-surface tracking-tight">
            МИССИИ
          </h1>
        </div>
        <p className="font-mono text-[12px] text-on-surface-variant leading-relaxed relative">
          6 активных миссий — по одной на навык. Завершай этапы по таймеру, очки
          идут к навыку категории.
        </p>
        <div className="flex items-center gap-4 mt-2 relative">
          <Metric
            icon="workspace_premium"
            value={`${data.stats.completed}/${data.stats.total}`}
            label="Завершено"
            color="#e9b3ff"
          />
          <div className="w-px h-8 bg-outline-variant/40" />
          <Metric
            icon="bolt"
            value={`${data.stats.inProgress}`}
            label="В работе"
            color="#00f2ff"
          />
        </div>
      </section>

      {/* Tabs: Активные / Премиум */}
      <section className="flex items-center gap-2">
        <button
          onClick={() => setTab("active")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border font-display text-[12px] font-bold uppercase tracking-wider transition-all",
            tab === "active"
              ? "bg-primary-container text-on-primary border-primary-container neon-glow-primary"
              : "bg-surface-container/50 text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
          )}
        >
          <MaterialIcon name="flash_on" size={16} fill={tab === "active"} />
          Активные
          <span
            className={cn(
              "ml-1 font-mono text-[10px] px-1.5 rounded-full",
              tab === "active" ? "bg-on-primary/20" : "bg-surface-container-high"
            )}
          >
            {data.free.length}
          </span>
        </button>
        <button
          onClick={() => setTab("premium")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border font-display text-[12px] font-bold uppercase tracking-wider transition-all",
            tab === "premium"
              ? "text-on-surface border-primary-container/60"
              : "bg-surface-container/50 text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
          )}
          style={
            tab === "premium"
              ? {
                  background: "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(22,22,24,0.7))",
                  boxShadow: "0 0 18px rgba(251,191,36,0.18)",
                }
              : undefined
          }
        >
          <MaterialIcon name="diamond" size={16} fill={tab === "premium"} />
          Премиум
          <span
            className={cn(
              "ml-1 font-mono text-[10px] px-1.5 rounded-full",
              tab === "premium" ? "bg-amber-400/20 text-amber-300" : "bg-surface-container-high"
            )}
          >
            {data.premium.length}
          </span>
        </button>
      </section>

      {/* Mission list */}
      <section className="flex flex-col gap-3">
        {tab === "premium" && (
          <div
            className="rounded-xl p-3 flex items-center gap-2.5 border"
            style={{
              background: data.premiumUser
                ? "linear-gradient(135deg, rgba(251,191,36,0.14), rgba(22,22,24,0.5))"
                : "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(22,22,24,0.5))",
              borderColor: data.premiumUser
                ? "rgba(251,191,36,0.40)"
                : "rgba(251,191,36,0.25)",
            }}
          >
            <MaterialIcon name="diamond" size={18} className="text-amber-400" fill />
            <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed flex-1">
              {data.premiumUser
                ? `Премиум активен — доступны все ${data.stats.total} миссий. Выполняй любые, очки идут навыку категории.`
                : `Без премиум-подписки миссии заблокированы. Оформи подписку в настройках, чтобы выполнять любые из ${data.stats.total} миссий.`}
            </p>
            {!data.premiumUser && (
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("neon-open-settings"))
                }
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-amber-400/20 border border-amber-400/40 text-amber-300 font-display text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform"
              >
                <MaterialIcon name="diamond" size={12} fill />
                Оформить
              </button>
            )}
          </div>
        )}

        {list.map((m, i) => (
          <MissionCard
            key={m.template.id}
            template={m.template}
            state={m.state}
            index={i}
            premium={tab === "premium"}
            onChanged={refetch}
          />
        ))}

        {list.length === 0 && (
          <div className="glass-panel rounded-xl p-8 text-center text-on-surface-variant font-mono text-sm">
            {tab === "active"
              ? "Все миссии завершены — вы легенда!"
              : "Все премиум-миссии завершены"}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color }}>
        <MaterialIcon name={icon} size={18} fill />
      </span>
      <div className="flex flex-col leading-none">
        <span className="font-display text-sm font-bold text-on-surface">
          {value}
        </span>
        <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

function MissionsSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-4 animate-pulse">
      <div className="h-36 rounded-xl bg-surface-container-high/60" />
      <div className="h-11 rounded-lg bg-surface-container-high/60" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-56 rounded-xl bg-surface-container-high/60" />
      ))}
    </div>
  );
}
