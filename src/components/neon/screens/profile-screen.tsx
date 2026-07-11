"use client";

import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Attr = {
  id: string;
  key: string;
  label: string;
  icon: string;
  value: number;
  color: string;
  percent: number;
};

type ChartPoint = { month: string; xp: number };

type ProfileData = {
  user: {
    displayName: string;
    rankTitle: string;
    level: number;
    xpCurrent: number;
    xpTotal: number;
    streakDays: number;
    completionRate: number;
    topPercent: number;
  };
  attributes: Attr[];
  chart: ChartPoint[];
};

export function ProfileScreen() {
  const { data, loading } = useApi<ProfileData>("/api/profile");

  if (loading || !data) {
    return <ProfileSkeleton />;
  }

  const { user, attributes, chart } = data;
  const xpPercent = Math.round((user.xpCurrent / user.xpTotal) * 100);

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Avatar & rank */}
      <section className="flex flex-col items-center gap-3 relative">
        <div className="relative w-32 h-32">
          {/* decorative rings */}
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
          {/* Rank badge */}
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

        {/* XP bar */}
        <div className="w-full max-w-[300px] flex flex-col gap-1.5 mt-1">
          <div className="flex justify-between items-baseline">
            <span className="font-display text-[11px] font-bold tracking-[0.08em] text-on-surface-variant uppercase">
              XP · УРОВЕНЬ {user.level}
            </span>
            <span className="font-mono text-[12px] text-primary-fixed-dim">
              {user.xpCurrent.toLocaleString("ru-RU")} /{" "}
              {user.xpTotal.toLocaleString("ru-RU")}
            </span>
          </div>
          <div className="relative w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full progress-bar-fill transition-all duration-700"
              style={{
                width: `${xpPercent}%`,
                background: "linear-gradient(90deg, #00dbe7, #00f2ff)",
                color: "#00f2ff",
              }}
            />
          </div>
          <div className="flex justify-end">
            <span className="font-mono text-[10px] text-primary-fixed-dim">
              {xpPercent}% до уровня {user.level + 1}
            </span>
          </div>
        </div>
      </section>

      {/* Attributes */}
      <section className="glass-panel rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-on-surface">
            Атрибуты
          </h3>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            6/6
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {attributes.map((a) => (
            <AttributeRow key={a.id} attr={a} />
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

function AttributeRow({ attr }: { attr: Attr }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span style={{ color: attr.color }}>
            <MaterialIcon name={attr.icon} size={16} fill />
          </span>
          <span className="font-mono text-[10px] font-medium text-on-surface uppercase tracking-wider">
            {attr.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className="font-display text-sm font-bold"
            style={{ color: attr.color }}
          >
            {attr.value.toFixed(1)}
          </span>
          <span className="font-mono text-[9px] text-on-surface-variant">
            /10
          </span>
        </div>
      </div>
      <div className="relative w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full progress-bar-fill transition-all duration-700"
          style={{ width: `${attr.percent}%`, background: attr.color, color: attr.color }}
        />
      </div>
    </div>
  );
}

function ProgressChart({ points }: { points: ChartPoint[] }) {
  const max = Math.max(...points.map((p) => p.xp), 1);
  const w = 100;
  const h = 100;
  // Build a smooth-ish polyline path
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - (p.xp / max) * (h - 8) - 4;
    return { x, y };
  });
  const linePath = coords
    .map((c, i) => (i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`))
    .join(" ");
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;

  return (
    <div className="relative h-48 w-full">
      {/* Y axis labels */}
      <div className="absolute left-0 inset-y-0 w-9 flex flex-col justify-between text-on-surface-variant font-mono text-[9px] text-right pr-1 py-1">
        <span>{Math.round(max / 1000)}k</span>
        <span>{Math.round((max * 3) / 4 / 1000)}k</span>
        <span>{Math.round((max / 2) / 1000)}k</span>
        <span>{Math.round((max / 4) / 1000)}k</span>
        <span>0</span>
      </div>
      {/* Chart area */}
      <div className="absolute left-9 right-0 inset-y-0">
        {/* grid lines */}
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
            <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,242,255,0.35)" />
              <stop offset="100%" stopColor="rgba(0,242,255,0)" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#xpFill)" stroke="none" />
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
      {/* X axis labels */}
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
      <div className="h-64 rounded-xl bg-surface-container-high/60" />
      <div className="h-72 rounded-xl bg-surface-container-high/60" />
    </div>
  );
}
