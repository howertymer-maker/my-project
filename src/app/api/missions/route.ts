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

export async function PATCH(req: NextRequest) {
  const { id, progress } = await req.json();
  const completed = progress >= 100;

  const mission = await db.mission.update({
    where: { id },
    data: { progress, completed },
  });

  return NextResponse.json({
    id: mission.id,
    progress: mission.progress,
    completed: mission.completed,
  });
}
