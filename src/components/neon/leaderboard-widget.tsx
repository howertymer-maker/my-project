"use client";

import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Leader = {
  rank: number;
  id: string;
  displayName: string;
  rankTitle: string;
  rankColor: string;
  avatarUrl: string | null;
  premium: boolean;
  totalPoints: number;
  isYou: boolean;
};

type LeaderboardData = { leaders: Leader[] };

const RANK_STYLES = [
  { color: "#fbbf24", icon: "emoji_events", label: "1 место" },
  { color: "#c0c0c0", icon: "military_tech", label: "2 место" },
  { color: "#cd7f32", icon: "military_tech", label: "3 место" },
];

function Avatar({ name, avatarUrl, rank }: { name: string; avatarUrl: string | null; rank: number }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const hue = [40, 0, 25][rank - 1] ?? 210;
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full object-cover" />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full grid place-items-center border font-display text-[13px] font-extrabold"
      style={{
        borderColor: `${RANK_STYLES[rank - 1]?.color ?? "#849495"}55`,
        background: `linear-gradient(135deg, hsl(${hue},60%,20%), #0A0A0B)`,
        color: RANK_STYLES[rank - 1]?.color ?? "#e5e2e3",
      }}
    >
      {initials}
    </div>
  );
}

export function LeaderboardWidget() {
  const { data, loading } = useApi<LeaderboardData>("/api/leaderboard");

  if (loading || !data || data.leaders.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <MaterialIcon name="leaderboard" size={18} className="text-amber-400" fill />
        <h3 className="font-display text-base font-bold text-on-surface">
          Топ-3 участника
        </h3>
      </div>

      <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
        {data.leaders.map((leader) => {
          const style = RANK_STYLES[leader.rank - 1];
          return (
            <div
              key={leader.id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-colors",
                leader.isYou && "bg-primary-container/10 border border-primary-container/30"
              )}
            >
              {/* Rank badge */}
              <div
                className="shrink-0 w-8 h-8 rounded-full grid place-items-center"
                style={{
                  background: `${style?.color}20`,
                  border: `1px solid ${style?.color}55`,
                }}
              >
                <MaterialIcon
                  name={style?.icon ?? "military_tech"}
                  size={18}
                  className=""
                  fill
                />
                <span className="sr-only">{style?.label}</span>
              </div>

              {/* Avatar */}
              <Avatar name={leader.displayName} avatarUrl={leader.avatarUrl} rank={leader.rank} />

              {/* Name + rank */}
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-display text-sm font-bold truncate"
                    style={{ color: style?.color }}
                  >
                    {leader.displayName}
                  </span>
                  {leader.isYou && (
                    <span className="font-mono text-[9px] text-primary-fixed uppercase tracking-wider bg-primary-container/15 px-1.5 py-0.5 rounded shrink-0">
                      Вы
                    </span>
                  )}
                  {leader.premium && (
                    <MaterialIcon name="diamond" size={12} className="text-amber-400 shrink-0" fill />
                  )}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider whitespace-nowrap" style={{ color: leader.rankColor }}>
                  {leader.rankTitle}
                </span>
              </div>

              {/* Points */}
              <div className="flex flex-col items-end shrink-0">
                <span
                  className="font-display text-base font-extrabold leading-none"
                  style={{ color: style?.color }}
                >
                  {leader.totalPoints.toLocaleString("ru-RU")}
                </span>
                <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                  очк
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
