import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// POST: subscribe to push notifications
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint, keys } = await req.json();
  if (!endpoint || !keys) return NextResponse.json({ error: "endpoint+keys required" }, { status: 400 });

  await db.pushSubscription.upsert({
    where: { endpoint },
    create: { userId: user.id, endpoint, keys: JSON.stringify(keys) },
    update: { userId: user.id, keys: JSON.stringify(keys) },
  });
  return NextResponse.json({ ok: true });
}

// DELETE: unsubscribe
export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint } = await req.json();
  if (!endpoint) return NextResponse.json({ error: "endpoint required" }, { status: 400 });

  await db.pushSubscription.deleteMany({ where: { endpoint, userId: user.id } });
  return NextResponse.json({ ok: true });
}
