import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Cron job: take a daily snapshot of each user's total points.
// Run daily (e.g. at 23:59) via external cron.
// GET /api/cron/snapshot?key=YOUR_CRON_SECRET
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const expectedKey = process.env.CRON_SECRET;

  if (expectedKey && key !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const users = await db.user.findMany({ select: { id: true } });
  let created = 0;

  for (const user of users) {
    const attrs = await db.attribute.findMany({
      where: { userId: user.id },
      select: { points: true },
    });
    const totalPoints = attrs.reduce((s, a) => s + a.points, 0);

    // upsert: one snapshot per user per day
    const existing = await db.skillHistory.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
    });
    if (!existing) {
      await db.skillHistory.create({
        data: { userId: user.id, date: today, totalPoints },
      });
      created++;
    }
  }

  return NextResponse.json({ ok: true, users: users.length, created, date: today });
}
