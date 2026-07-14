import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET — returns top 3 users by total skill points
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all users with their attributes
  const users = await db.user.findMany({
    select: {
      id: true,
      displayName: true,
      rankTitle: true,
      avatarUrl: true,
      premium: true,
      attributes: { select: { points: true } },
    },
  });

  // Calculate total points per user
  const ranked = users
    .map((u) => ({
      id: u.id,
      displayName: u.displayName,
      rankTitle: u.rankTitle,
      avatarUrl: u.avatarUrl,
      premium: u.premium,
      totalPoints: u.attributes.reduce((s, a) => s + a.points, 0),
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 3);

  return NextResponse.json({
    leaders: ranked.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      displayName: u.displayName,
      rankTitle: u.rankTitle,
      avatarUrl: u.avatarUrl,
      premium: u.premium,
      totalPoints: u.totalPoints,
      isYou: u.id === user.id,
    })),
  });
}
