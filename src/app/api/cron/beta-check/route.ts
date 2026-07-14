import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Cron job: check if beta test has expired.
// If expired — remove premium from ALL users (progress stays).
// Run hourly via external cron.
// GET /api/cron/beta-check?key=YOUR_CRON_SECRET
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const expectedKey = process.env.CRON_SECRET;

  if (expectedKey && key !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const setting = await db.setting.findUnique({ where: { key: "betaTestEndsAt" } });
  if (!setting) {
    return NextResponse.json({ active: false, message: "No beta test running" });
  }

  const endsAt = new Date(setting.value);
  const now = new Date();

  if (now >= endsAt) {
    // Beta test expired — remove premium from all users
    await db.user.updateMany({ data: { premium: false } });
    await db.setting.delete({ where: { key: "betaTestEndsAt" } }).catch(() => {});

    return NextResponse.json({
      ok: true,
      expired: true,
      message: "Beta test ended. Premium removed from all users. Progress preserved.",
    });
  }

  const remaining = Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return NextResponse.json({
    active: true,
    remainingDays: remaining,
    endsAt: setting.value,
  });
}
