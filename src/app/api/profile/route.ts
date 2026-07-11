import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await db.user.findFirst({
    include: {
      attributes: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Build 6-month progress chart data
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"];
  const base = user.xpCurrent;
  const chartData = months.map((m, i) => ({
    month: m,
    xp: Math.round(base * (0.45 + i * 0.11)),
  }));

  return NextResponse.json({
    user: {
      id: user.id,
      displayName: user.displayName,
      rankTitle: user.rankTitle,
      level: user.level,
      xpCurrent: user.xpCurrent,
      xpTotal: user.xpTotal,
      streakDays: user.streakDays,
      completionRate: user.completionRate,
      topPercent: user.topPercent,
    },
    attributes: user.attributes.map((a) => ({
      id: a.id,
      key: a.key,
      label: a.label,
      icon: a.icon,
      value: a.value,
      color: a.color,
      percent: Math.round(a.value * 10),
    })),
    chart: chartData,
  });
}
