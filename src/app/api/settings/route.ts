import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { isBetaTestActive } from "@/lib/beta";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const betaActive = await isBetaTestActive();
  return NextResponse.json({
    premium: user.premium || betaActive,
    betaActive,
    displayName: user.displayName,
  });
}

export async function PATCH(req: NextRequest) {
  const { premium } = await req.json();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const betaActive = await isBetaTestActive();
  // During beta test, premium is forced ON — user can't turn it off
  if (betaActive) {
    return NextResponse.json({ premium: true, betaActive: true });
  }
  const updated = await db.user.update({
    where: { id: user.id },
    data: { premium: !!premium },
    select: { id: true, premium: true },
  });
  return NextResponse.json({ premium: updated.premium });
}
