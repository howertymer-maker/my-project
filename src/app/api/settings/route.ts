import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await db.user.findFirst({
    select: { id: true, premium: true, displayName: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ premium: user.premium, displayName: user.displayName });
}

export async function PATCH(req: NextRequest) {
  const { premium } = await req.json();
  const user = await db.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const updated = await db.user.update({
    where: { id: user.id },
    data: { premium: !!premium },
    select: { id: true, premium: true },
  });
  return NextResponse.json({ premium: updated.premium });
}
