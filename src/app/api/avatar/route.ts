import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

// POST: upload avatar as base64 (stored in DB, no filesystem needed)
// Works on Vercel/serverless — no persistent filesystem required.
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
  }

  // Validate type and size (max 500KB — base64 in DB, keep it small)
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Только изображения" }, { status: 400 });
  }
  if (file.size > 500 * 1024) {
    return NextResponse.json({ error: "Максимум 500 КБ" }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // store as data URI: "data:image/png;base64,...."
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    await db.user.update({
      where: { id: user.id },
      data: { avatarUrl: dataUri },
    });

    return NextResponse.json({ ok: true, avatarUrl: dataUri });
  } catch {
    return NextResponse.json(
      { error: "Не удалось сохранить" },
      { status: 500 }
    );
  }
}
