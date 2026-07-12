import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const POINTS_PER_LEVEL = 1000;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const attributes = await db.attribute.findMany({
    where: { userId: user.id },
    orderBy: { sortOrder: "asc" },
  });

  const totalPoints = attributes.reduce((s, a) => s + a.points, 0);
  const totalLevel = Math.floor(totalPoints / POINTS_PER_LEVEL);

  // ===== Real statistics =====
  // 1) Streak days: count consecutive days (ending today or yesterday) where the
  //    user completed at least one habit. Falls back to 0.
  const habits = await db.habit.findMany({ where: { userId: user.id } });
  const allHabitsToday = habits.filter((h) => h.completed).length;
  // We approximate streak from the max habit streak (already tracked per habit).
  const streakDays = habits.reduce((m, h) => Math.max(m, h.streak), 0);

  // 2) Completion rate: % of habits completed today (0..100)
  const completionRate =
    habits.length > 0
      ? Math.round((allHabitsToday / habits.length) * 100)
      : 0;

  // 3) Top percent: compare user's totalPoints against all users.
  //    Lower percentile = better. topPercent = % of users with MORE points.
  const allUsers = await db.user.findMany({
    select: { id: true },
  });
  // count users with strictly more total points — approximate by computing each
  // user's attribute sum. For small scale this is fine.
  let betterCount = 0;
  for (const u of allUsers) {
    if (u.id === user.id) continue;
    const sum = await db.attribute.aggregate({
      where: { userId: u.id },
      _sum: { points: true },
    });
    if ((sum._sum.points ?? 0) > totalPoints) betterCount++;
  }
  const otherCount = Math.max(1, allUsers.length - 1);
  const topPercent = Math.round((betterCount / otherCount) * 100);

  const skills = attributes.map((a) => {
    const skillLevel = Math.floor(a.points / POINTS_PER_LEVEL);
    const pointsInLevel = a.points % POINTS_PER_LEVEL;
    const levelPercent = Math.round((pointsInLevel / POINTS_PER_LEVEL) * 100);
    return {
      id: a.id,
      key: a.key,
      label: a.label,
      icon: a.icon,
      color: a.color,
      source: a.source,
      points: a.points,
      skillLevel,
      pointsInLevel,
      nextLevelAt: (skillLevel + 1) * POINTS_PER_LEVEL,
      levelPercent,
      barValue: Math.min(10, skillLevel),
      barPercent: Math.min(100, Math.round((a.points / (POINTS_PER_LEVEL * 10)) * 100)),
    };
  });

  const consistency = skills.find((s) => s.key === "consistency") ?? null;
  const missionSkills = skills.filter((s) => s.source === "missions");

  // Build progress chart from REAL SkillHistory data (daily snapshots).
  // If there's no history yet (new user), fall back to a flat line at totalPoints.
  const history = await db.skillHistory.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
    take: 180, // up to 6 months of daily snapshots
  });

  let chartData: { month: string; points: number }[];
  if (history.length >= 2) {
    // Group snapshots by month and take the last snapshot of each month
    const byMonth = new Map<string, number>();
    for (const h of history) {
      const monthKey = h.date.slice(0, 7); // "YYYY-MM"
      byMonth.set(monthKey, h.totalPoints);
    }
    const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
    chartData = Array.from(byMonth.entries())
      .slice(-6) // last 6 months
      .map(([ym, pts]) => {
        const m = parseInt(ym.slice(5, 7), 10) - 1;
        return { month: monthNames[m] ?? ym, points: pts };
      });
  } else {
    // Fallback: show current points as a flat line (new user, no history yet)
    chartData = [
      { month: "Сейчас", points: totalPoints },
    ];
  }

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: user.displayName,
      rankTitle: user.rankTitle,
      level: totalLevel,
      totalPoints,
      streakDays,
      completionRate,
      topPercent,
      premium: user.premium,
    },
    consistency,
    missionSkills,
    allSkills: skills,
    chart: chartData,
    pointsPerLevel: POINTS_PER_LEVEL,
  });
}
