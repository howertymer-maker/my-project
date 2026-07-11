import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await db.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const habits = await db.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({
    habits: habits.map((h) => ({
      id: h.id,
      title: h.title,
      category: h.category,
      color: h.color,
      target: h.target,
      completed: h.completed,
      streak: h.streak,
      weekStart: h.weekStart,
      rewards: {
        discipline: h.rewardDiscipline,
        social: h.rewardSocial,
        mental: h.rewardMental,
        physical: h.rewardPhysical,
        financial: h.rewardFinancial,
        appearance: h.rewardAppearance,
      },
      subtasksTotal: h.subtasksTotal,
      subtasksDone: h.subtasksDone,
    })),
    streakDays: 14,
  });
}

export async function PATCH(req: NextRequest) {
  const { id, completed } = await req.json();

  const habit = await db.habit.update({
    where: { id },
    data: { completed },
  });

  return NextResponse.json({
    id: habit.id,
    completed: habit.completed,
  });
}
