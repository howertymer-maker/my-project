import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getRankByPoints } from "@/lib/ranks";

export const dynamic = "force-dynamic";

// GET — returns top 3 users by total skill points
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.user.findMany({
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      premium: true,
      attributes: { select: { points: true } },
    },
  });

  const ranked = users
    .map((u) => {
      const totalPoints = u.attributes.reduce((s, a) => s + a.points, 0);
      const rank = getRankByPoints(totalPoints);
      return {
        id: u.id,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        premium: u.premium,
        totalPoints,
        rankTitle: rank.title,
        rankColor: rank.color,
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 3);

  return NextResponse.json({
    leaders: ranked.map((u, i) => ({
      rank: i + 1,
      ...u,
      isYou: u.id === user.id,
    })),
  });
}
