// Automatic rank system based on total level (totalPoints / 1000, floored)
// Rank is computed dynamically — no need to store it in the database.

export type RankInfo = {
  title: string;
  color: string;
  icon: string;
  minLevel: number;
  maxLevel: number;
};

export const RANKS: RankInfo[] = [
  { title: "Новичок",         color: "#b9cacb", icon: "child_care",       minLevel: 1,   maxLevel: 5 },
  { title: "Ученик",          color: "#849495", icon: "school",           minLevel: 6,   maxLevel: 10 },
  { title: "Боец",            color: "#f97316", icon: "swords",           minLevel: 11,  maxLevel: 20 },
  { title: "Опытный",         color: "#eab308", icon: "military_tech",    minLevel: 21,  maxLevel: 35 },
  { title: "Эксперт",         color: "#00f2ff", icon: "verified",         minLevel: 36,  maxLevel: 50 },
  { title: "Мастер",          color: "#a855f7", icon: "auto_awesome",     minLevel: 51,  maxLevel: 70 },
  { title: "Несдающийся",     color: "#e9b3ff", icon: "diamond",          minLevel: 71,  maxLevel: 100 },
  { title: "Железобетонный",  color: "#fbbf24", icon: "emoji_events",     minLevel: 101, maxLevel: 999999 },
];

/**
 * Returns the rank for a given total level (floor(totalPoints / 1000)).
 */
export function getRankByLevel(level: number): RankInfo {
  return RANKS.find((r) => level >= r.minLevel && level <= r.maxLevel) ?? RANKS[0];
}

/**
 * Returns the rank for a given total points amount.
 */
export function getRankByPoints(totalPoints: number): RankInfo {
  return getRankByLevel(Math.floor(totalPoints / 1000));
}
