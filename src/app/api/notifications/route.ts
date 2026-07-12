import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET notifications for the current user, newest first.
// Optional ?filter=reward|mission|social|streak|challenge|system|all
// Optional ?unread=1 to return only unread
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") || "all";
  const onlyUnread = searchParams.get("unread") === "1";

  const where: Record<string, unknown> = { userId: user.id };
  if (filter !== "all") where.type = filter;
  if (onlyUnread) where.read = false;

  const notifications = await db.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await db.notification.count({
    where: { userId: user.id, read: false },
  });

  return NextResponse.json({
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      icon: n.icon,
      color: n.color,
      title: n.title,
      body: n.body,
      read: n.read,
      createdAt: n.createdAt.toISOString(),
    })),
    unreadCount,
  });
}

// PATCH — mark one (id=...) or all (id=all) as read
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  if (id === "all") {
    await db.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return NextResponse.json({ ok: true, marked: "all" });
  }

  await db.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });
  return NextResponse.json({ ok: true, id });
}
