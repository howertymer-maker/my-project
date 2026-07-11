import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const missions = await db.mission.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json({
    missions: missions.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      category: m.category,
      difficulty: m.difficulty,
      xp: m.xp,
      duration: m.duration,
      progress: m.progress,
      completed: m.completed,
      accentColor: m.accentColor,
      icon: m.icon,
    })),
  });
}

// Advancing a mission awards proportional points to the matching skill.
// category == skill key (physical | mental | social | financial | discipline | appearance)
export async function PATCH(req: NextRequest) {
  const { id, progress } = await req.json();

  const mission = await db.mission.findUnique({ where: { id } });
  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  const oldProgress = mission.progress;
  const clamped = Math.max(0, Math.min(100, progress));
  const delta = clamped - oldProgress;
  const completed = clamped >= 100;

  // points awarded for this delta = (delta / 100) * mission.xp
  const pointsToAdd = Math.round((delta / 100) * mission.xp);

  const updated = await db.mission.update({
    where: { id },
    data: { progress: clamped, completed },
  });

  if (pointsToAdd !== 0) {
    const user = await db.user.findFirst();
    if (user) {
      await db.attribute.updateMany({
        where: { userId: user.id, key: mission.category },
        data: { points: { increment: pointsToAdd } },
      });
    }
  }

  const skill = await db.attribute.findFirst({
    where: { key: mission.category },
  });

  return NextResponse.json({
    id: updated.id,
    progress: updated.progress,
    completed: updated.completed,
    pointsAwarded: pointsToAdd,
    skillKey: mission.category,
    skillPoints: skill?.points ?? 0,
  });
}
