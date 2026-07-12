import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET bug reports for the current user (their own reports)
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await db.bugReport.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    reports: reports.map((r) => ({
      id: r.id,
      title: r.title,
      body: r.body,
      category: r.category,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

// POST — create a new bug report
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, body, category } = await req.json();
  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: "Заголовок и описание обязательны" }, { status: 400 });
  }

  const report = await db.bugReport.create({
    data: {
      userId: user.id,
      title: title.trim(),
      body: body.trim(),
      category: category || "bug",
      status: "open",
    },
  });

  return NextResponse.json({ ok: true, id: report.id });
}
