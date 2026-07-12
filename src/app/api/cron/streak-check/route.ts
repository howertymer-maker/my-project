import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notify } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Cron job: check habits with streaks at risk and notify users.
// Trigger this endpoint daily (e.g. at 20:00) via an external cron service.
// Security: protected by CRON_SECRET env var.

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const expectedKey = process.env.CRON_SECRET;

  if (expectedKey && key !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.user.findMany({ select: { id: true } });
  let notified = 0;

  for (const user of users) {
    const habits = await db.habit.findMany({
      where: { userId: user.id, streak: { gte: 3 } },
    });

    for (const habit of habits) {
      if (!habit.completed) {
        await notify({
          userId: user.id,
          type: "streak",
          icon: "local_fire_department",
          color: "#f97316",
          title: "Серия под угрозой!",
          body: `Серия «${habit.title}» (${habit.streak} дней) прервётся, если не отметишь привычку сегодня.`,
        });
        notified++;
      }
    }
  }

  return NextResponse.json({
    ok: true,
    checkedUsers: users.length,
    notificationsCreated: notified,
  });
}
