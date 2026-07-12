"use client";

import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Skill = {
  id: string;
  key: string;
  label: string;
  icon: string;
  color: string;
  source: string; // "missions" | "habits"
  points: number;
  skillLevel: number;
  pointsInLevel: number;
  nextLevelAt: number;
  levelPercent: number; // progress within current level (0..100)
  barValue: number; // capped 0..10 for the global bar
  barPercent: number; // 0..100 for the global bar
};

type ChartPoint = { month: string; points: number };

type ProfileData = {
  user: {
    displayName: string;
    rankTitle: string;
    level: number;
    totalPoints: number;
    streakDays: number;
    completionRate: number;
    topPercent: number;
  };
  consistency: Skill | null;
  missionSkills: Skill[];
  allSkills: Skill[];
  chart: ChartPoint[];
  pointsPerLevel: number;
};

export function ProfileScreen() {
  const { data, loading } = useApi<ProfileData>("/api/profile");

  if (loading || !data) {
    return <ProfileSkeleton />;
  }

  const { user, consistency, missionSkills, chart } = data;

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Avatar & rank */}
      <section className="flex flex-col items-center gap-3 relative">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full border-2 border-surface-container-high animate-spin-slow" />
          <div
            className="absolute inset-0 rounded-full border-t-2 border-primary-container animate-spin-med neon-glow-primary"
            style={{ borderColor: "#00f2ff transparent transparent transparent" }}
          />
          <div className="absolute inset-[6px] rounded-full overflow-hidden bg-surface-container border-2 border-outline-variant">
            <img
              src="/avatar.png"
              alt="Аватар игрока"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-surface-container-highest px-3 py-1 rounded-full border border-primary-container/50 neon-glow-primary z-10 flex items-center gap-1.5 whitespace-nowrap">
            <MaterialIcon
              name="workspace_premium"
              size={14}
              className="text-primary-container"
              fill
            />
            <span className="font-mono text-[10px] font-medium text-on-surface uppercase tracking-widest">
              {user.rankTitle}
            </span>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-on-surface mt-4 text-center">
          {user.displayName}
        </h2>

        {/* Total level summary (derived from all skill points) */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            Общий уровень
          </span>
          <span className="font-display text-sm font-extrabold text-primary-fixed text-glow-primary">
            {user.level}
          </span>
          <span className="font-mono text-[10px] text-on-surface-variant">
            · ещё {(user.level + 1) * 1000 - user.totalPoints} очк до ур. {user.level + 1}
          </span>
        </div>
      </section>

      {/* 7th skill — Дисциплинированность (leveled EXCLUSIVELY by habits) */}
      {consistency && (
        <ConsistencyCard skill={consistency} />
      )}

      {/* 6 mission-driven skills */}
      <section className="glass-panel rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-on-surface">
            Навыки
          </h3>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            прокач. миссиями
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {missionSkills.map((s) => (
            <SkillRow key={s.id} skill={s} />
          ))}
        </div>
      </section>

      {/* Progress statistics */}
      <section className="glass-panel rounded-xl p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-xl font-bold text-on-surface">
            Статистика прогресса
          </h3>
          <div className="flex items-center gap-1 bg-surface-container-highest rounded-md p-0.5 border border-outline-variant/40">
            {["1М", "6М", "1Г"].map((p, i) => (
              <button
                key={p}
                className={cn(
                  "font-mono text-[10px] px-2 py-0.5 rounded transition-colors",
                  i === 1
                    ? "bg-primary-container/20 text-primary-fixed"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <ProgressChart points={chart} />

        <div className="flex justify-between pt-3 border-t border-outline-variant/30">
          <StatChip
            icon="local_fire_department"
            value={`${user.streakDays} Дня`}
            label="Серия"
            color="#00f2ff"
          />
          <StatChip
            icon="task_alt"
            value={`${user.completionRate}%`}
            label="Выполнено"
            color="#b6f700"
          />
          <StatChip
            icon="emoji_events"
            value={`Топ ${user.topPercent}%`}
            label="Рейтинг"
            color="#e9b3ff"
          />
        </div>
      </section>
    </div>
  );
}

/** Prominent card for the 7th skill (Дисциплинированность) — leveled only by habits. */
function ConsistencyCard({ skill }: { skill: Skill }) {
  return (
    <section
      className="relative rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(251,191,36,0.10), rgba(22,22,24,0.6))",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(251,191,36,0.30)",
        boxShadow: "0 0 24px rgba(251,191,36,0.10)",
      }}
    >
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-25 blur-3xl"
        style={{ background: skill.color }}
      />
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-lg grid place-items-center border"
            style={{
              background: `${skill.color}1a`,
              borderColor: `${skill.color}66`,
              color: skill.color,
            }}
          >
            <MaterialIcon name={skill.icon} size={22} fill />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-lg font-bold text-on-surface leading-none">
              {skill.label}
            </span>
            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mt-1 truncate">
              прокачивается привычками
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span
            className="font-display text-xl font-extrabold leading-none"
            style={{ color: skill.color }}
          >
            {(1000 - skill.pointsInLevel).toLocaleString("ru-RU")}
          </span>
          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mt-1 whitespace-nowrap">
            очк до ур. {skill.skillLevel + 1}
          </span>
        </div>
      </div>

      {/* Level progress bar (within current level) */}
      <div className="flex flex-col gap-1.5 relative">
        <div className="flex justify-between items-baseline">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            Уровень навыка {skill.skillLevel}
          </span>
          <span className="font-mono text-[10px]" style={{ color: skill.color }}>
            {skill.pointsInLevel} / 1000
          </span>
        </div>
        <div className="relative w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full progress-bar-fill transition-all duration-700"
            style={{
              width: `${skill.levelPercent}%`,
              background: skill.color,
              color: skill.color,
            }}
          />
        </div>
        <div className="flex justify-end">
          <span className="font-mono text-[9px] text-on-surface-variant whitespace-nowrap">
            ещё {1000 - skill.pointsInLevel} очк до ур. {skill.skillLevel + 1}
          </span>
        </div>
      </div>
    </section>
  );
}

/** A mission-driven skill row showing points + level + progress bar. */
function SkillRow({ skill }: { skill: Skill }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span style={{ color: skill.color }}>
            <MaterialIcon name={skill.icon} size={16} fill />
          </span>
          <span className="font-mono text-[10px] font-medium text-on-surface uppercase tracking-wider">
            {skill.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider"
          >
            до ур.{skill.skillLevel + 1}:
          </span>
          <span
            className="font-display text-sm font-bold"
            style={{ color: skill.color }}
          >
            {(1000 - skill.pointsInLevel).toLocaleString("ru-RU")}
          </span>
          <span className="font-mono text-[9px] text-on-surface-variant">
            очк
          </span>
        </div>
      </div>
      <div className="relative w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full progress-bar-fill transition-all duration-700"
          style={{
            width: `${skill.barPercent}%`,
            background: skill.color,
            color: skill.color,
          }}
        />
      </div>
    </div>
  );
}

function ProgressChart({ points }: { points: ChartPoint[] }) {
  const max = Math.max(...points.map((p) => p.points), 1);
  const w = 100;
  const h = 100;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - (p.points / max) * (h - 8) - 4;
    return { x, y };
  });
  const linePath = coords
    .map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`))
    .join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <div className="relative h-48 w-full">
      <div className="absolute left-0 inset-y-0 w-9 flex flex-col justify-between text-on-surface-variant font-mono text-[9px] text-right pr-1 py-1">
        <span>{Math.round(max / 1000)}k</span>
        <span>{Math.round((max * 3) / 4 / 1000)}k</span>
        <span>{Math.round((max / 2) / 1000)}k</span>
        <span>{Math.round((max / 4) / 1000)}k</span>
        <span>0</span>
      </div>
      <div className="absolute left-9 right-0 inset-y-0">
        <div className="absolute inset-0 flex flex-col justify-between opacity-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-t border-on-surface w-full" />
          ))}
        </div>
        <svg
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pointsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,242,255,0.35)" />
              <stop offset="100%" stopColor="rgba(0,242,255,0)" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#pointsFill)" stroke="none" />
          <path
            d={linePath}
            fill="none"
            stroke="#00f2ff"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r="1.4"
              fill="#0A0A0B"
              stroke="#00f2ff"
              strokeWidth="0.8"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="absolute left-9 right-0 bottom-[-18px] flex justify-between font-mono text-[9px] text-on-surface-variant">
        {points.map((p) => (
          <span key={p.month}>{p.month}</span>
        ))}
      </div>
    </div>
  );
}

function StatChip({
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
    <div className="flex flex-col items-center gap-1">
      <span style={{ color }}>
        <MaterialIcon name={icon} size={20} fill />
      </span>
      <span className="font-display text-[13px] font-bold text-on-surface">
        {value}
      </span>
      <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8 pt-4 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-surface-container-high" />
        <div className="h-7 w-52 rounded bg-surface-container-high" />
        <div className="h-3 w-72 rounded bg-surface-container-high" />
      </div>
      <div className="h-32 rounded-xl bg-surface-container-high/60" />
      <div className="h-64 rounded-xl bg-surface-container-high/60" />
      <div className="h-72 rounded-xl bg-surface-container-high/60" />
    </div>
  );
}
