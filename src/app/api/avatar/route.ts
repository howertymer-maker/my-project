import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// POST: upload avatar (multipart/form-data with "file" field)
// Saves to public/avatars/<userId>.png and updates user.avatarUrl.
// For production, replace with S3/UploadThing/Cloudinary upload.
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

  // Validate type and size (max 2MB)
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Только изображения" }, { status: 400 });
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "Максимум 2 МБ" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "png";
  const filename = `${user.id}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "avatars");
  const filepath = path.join(uploadDir, filename);

  try {
    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const avatarUrl = `/avatars/${filename}`;
    await db.user.update({
      where: { id: user.id },
      data: { avatarUrl },
    });

    return NextResponse.json({ ok: true, avatarUrl });
  } catch (e) {
    return NextResponse.json(
      { error: "Не удалось сохранить файл" },
      { status: 500 }
    );
  }
}
