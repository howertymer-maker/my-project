import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET — returns beta test status
export async function GET() {
  const setting = await db.setting.findUnique({ where: { key: "betaTestEndsAt" } });
  if (!setting) {
    return NextResponse.json({ active: false });
  }
  const endsAt = new Date(setting.value);
  const now = new Date();
  const active = now < endsAt;
  const remaining = active ? Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return NextResponse.json({ active, endsAt: setting.value, remainingDays: remaining });
}

// POST — activate beta test (set all users to premium for N days)
// Body: { action: "activate", days: 4 } or { action: "deactivate" }
// Protected by CRON_SECRET to prevent public access
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const expectedKey = process.env.CRON_SECRET;

  if (expectedKey && key !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, days } = body as { action: "activate" | "deactivate"; days?: number };

  if (action === "activate") {
    const durationDays = days ?? 4;
    const endsAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    // Save beta test end date
    await db.setting.upsert({
      where: { key: "betaTestEndsAt" },
      create: { key: "betaTestEndsAt", value: endsAt.toISOString() },
      update: { value: endsAt.toISOString() },
    });

    // Set ALL users to premium
    await db.user.updateMany({ data: { premium: true } });

    return NextResponse.json({
      ok: true,
      message: `Beta test activated! Premium enabled for ALL users for ${durationDays} days.`,
      endsAt: endsAt.toISOString(),
    });
  }

  if (action === "deactivate") {
    await db.setting.delete({ where: { key: "betaTestEndsAt" } }).catch(() => {});
    await db.user.updateMany({ data: { premium: false } });

    return NextResponse.json({
      ok: true,
      message: "Beta test deactivated. Premium removed from all users. Progress preserved.",
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
