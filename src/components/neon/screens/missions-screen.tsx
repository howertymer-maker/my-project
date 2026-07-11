"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Mission = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string; // recruit | elite | legendary
  xp: number;
  duration: string;
  progress: number;
  completed: boolean;
  accentColor: string;
  icon: string;
};

type MissionsData = { missions: Mission[] };

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: "all", label: "Все", icon: "apps" },
  { key: "physical", label: "Физическое", icon: "directions_run" },
  { key: "social", label: "Социальное", icon: "forum" },
  { key: "mental", label: "Ментальное", icon: "psychology" },
  { key: "financial", label: "Финансовое", icon: "payments" },
  { key: "discipline", label: "Дисциплина", icon: "fitness_center" },
];

const DIFFICULTY: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  recruit: { label: "Новобранец", color: "#b9cacb", bg: "rgba(185,202,203,0.12)" },
  elite: { label: "Элитная", color: "#00f2ff", bg: "rgba(0,242,255,0.12)" },
  legendary: {
    label: "Легендарная",
    color: "#f3cfff",
    bg: "rgba(243,207,255,0.14)",
  },
};

export function MissionsScreen() {
  const { data, loading } = useApi<MissionsData>("/api/missions");
  const [cat, setCat] = useState<string>("all");

  if (loading || !data) {
    return <MissionsSkeleton />;
  }

  const missions = data.missions.filter(
    (m) => cat === "all" || m.category === cat
  );
  const totalXp = data.missions.reduce((s, m) => s + m.xp, 0);
  const completed = data.missions.filter((m) => m.completed).length;

  return (
    <div className="flex flex-col gap-5 pt-4">
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
          Выполняйте задания для получения опыта и повышения уровня развития.
        </p>
        <div className="flex items-center gap-4 mt-2 relative">
          <Metric icon="workspace_premium" value={`${completed}/${data.missions.length}`} label="Завершено" color="#e9b3ff" />
          <div className="w-px h-8 bg-outline-variant/40" />
          <Metric icon="bolt" value={`${totalXp.toLocaleString("ru-RU")}`} label="XP награда" color="#00f2ff" />
        </div>
      </section>

      {/* Category tabs */}
      <section className="-mx-5 px-5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 w-max pb-1">
          {CATEGORIES.map((c) => {
            const active = cat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all whitespace-nowrap",
                  active
                    ? "bg-primary-container text-on-primary border-primary-container neon-glow-primary"
                    : "bg-surface-container/50 text-on-surface-variant border-outline-variant/30 hover:text-on-surface hover:border-outline-variant/60"
                )}
              >
                <MaterialIcon name={c.icon} size={16} fill={active} />
                <span className="font-display text-[11px] font-bold uppercase tracking-wider">
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mission cards */}
      <section className="flex flex-col gap-3">
        {missions.map((m, i) => (
          <MissionCard key={m.id} mission={m} index={i} />
        ))}
        {missions.length === 0 && (
          <div className="glass-panel rounded-xl p-8 text-center text-on-surface-variant font-mono text-sm">
            Нет миссий в этой категории
          </div>
        )}
      </section>
    </div>
  );
}

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const [progress, setProgress] = useState(mission.progress);
  const diff = DIFFICULTY[mission.difficulty] ?? DIFFICULTY.recruit;
  const isComplete = progress >= 100;

  const advance = async () => {
    if (isComplete) return;
    const next = Math.min(100, progress + 10);
    setProgress(next);
    try {
      await fetch("/api/missions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: mission.id, progress: next }),
      });
    } catch {
      setProgress(progress);
    }
  };

  return (
    <div
      className="glass-panel rounded-xl p-4 flex flex-col gap-3 animate-fade-in-up relative overflow-hidden"
      style={{
        animationDelay: `${index * 0.06}s`,
        opacity: 0,
        borderColor: `${mission.accentColor}33`,
      }}
    >
      {/* shimmer accent */}
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl"
        style={{ background: mission.accentColor }}
      />
      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="shrink-0 w-11 h-11 rounded-lg grid place-items-center border"
            style={{
              background: `${mission.accentColor}1a`,
              borderColor: `${mission.accentColor}55`,
              color: mission.accentColor,
            }}
          >
            <MaterialIcon name={mission.icon} size={22} fill />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-display text-base font-bold text-on-surface leading-tight">
              {mission.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{ color: diff.color, background: diff.bg }}
              >
                {diff.label}
              </span>
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                <MaterialIcon name="schedule" size={11} />
                {mission.duration}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span
            className="font-display text-lg font-extrabold leading-none"
            style={{ color: mission.accentColor }}
          >
            +{mission.xp}
          </span>
          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mt-0.5">
            XP
          </span>
        </div>
      </div>

      <p className="font-mono text-[12px] text-on-surface-variant leading-relaxed line-clamp-2">
        {mission.description}
      </p>

      {/* progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            Прогресс
          </span>
          <span
            className="font-display text-sm font-bold"
            style={{ color: mission.accentColor }}
          >
            {progress}%
          </span>
        </div>
        <div className="relative w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full progress-bar-fill transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: mission.accentColor,
              color: mission.accentColor,
            }}
          />
        </div>
      </div>

      <button
        onClick={advance}
        disabled={isComplete}
        className={cn(
          "mt-1 w-full py-2.5 rounded-lg font-display text-[12px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2",
          isComplete
            ? "bg-secondary-fixed/15 text-secondary-fixed border border-secondary-fixed/40"
            : "bg-surface-container-high text-on-surface border border-outline-variant/40 hover:border-primary-container/50 hover:text-primary-fixed"
        )}
      >
        <MaterialIcon
          name={isComplete ? "task_alt" : "play_arrow"}
          size={16}
          fill={isComplete}
        />
        {isComplete ? "Завершено" : "Удерживать для выполнения"}
      </button>
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
    <div className="flex flex-col gap-5 pt-4 animate-pulse">
      <div className="h-36 rounded-xl bg-surface-container-high/60" />
      <div className="h-10 w-72 rounded-lg bg-surface-container-high/60" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-48 rounded-xl bg-surface-container-high/60" />
      ))}
    </div>
  );
}
