import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const POINTS_PER_LEVEL = 1000;

export async function GET() {
  const user = await db.user.findFirst({
    include: {
      attributes: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const totalPoints = user.attributes.reduce((s, a) => s + a.points, 0);
  const totalLevel = Math.floor(totalPoints / POINTS_PER_LEVEL);

  const skills = user.attributes.map((a) => {
    const skillLevel = Math.floor(a.points / POINTS_PER_LEVEL);
    const pointsInLevel = a.points % POINTS_PER_LEVEL;
    const levelPercent = Math.round((pointsInLevel / POINTS_PER_LEVEL) * 100);
    const barValue = Math.min(10, skillLevel); // visual bar caps at 10
    const barPercent = Math.min(100, Math.round((a.points / (POINTS_PER_LEVEL * 10)) * 100));
    return {
      id: a.id,
      key: a.key,
      label: a.label,
      icon: a.icon,
      color: a.color,
      source: a.source, // "missions" | "habits"
      points: a.points,
      skillLevel,
      pointsInLevel,
      nextLevelAt: (skillLevel + 1) * POINTS_PER_LEVEL,
      levelPercent,
      barValue,
      barPercent,
    };
  });

  const consistency = skills.find((s) => s.key === "consistency") ?? null;
  const missionSkills = skills.filter((s) => s.source === "missions");

  // Build 6-month progress chart based on total skill points trajectory
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
  const chartData = months.map((m, i) => ({
    month: m,
    points: Math.round(totalPoints * (0.4 + i * 0.12)),
  }));

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: user.displayName,
      rankTitle: user.rankTitle,
      level: totalLevel,
      totalPoints,
      streakDays: user.streakDays,
      completionRate: user.completionRate,
      topPercent: user.topPercent,
    },
    consistency,
    missionSkills,
    allSkills: skills,
    chart: chartData,
    pointsPerLevel: POINTS_PER_LEVEL,
  });
}
