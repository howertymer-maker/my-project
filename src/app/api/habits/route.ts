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

  // current consistency skill points (for live display)
  const consistency = await db.attribute.findFirst({
    where: { userId: user.id, key: "consistency" },
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
      rewardPoints: h.rewardPoints,
      subtasksTotal: h.subtasksTotal,
      subtasksDone: h.subtasksDone,
    })),
    streakDays: 14,
    consistencyPoints: consistency?.points ?? 0,
  });
}

// Toggling a habit awards/withdraws points to the 7th skill ("Постоянство")
export async function PATCH(req: NextRequest) {
  const { id, completed } = await req.json();

  const habit = await db.habit.findUnique({ where: { id } });
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  const wasCompleted = habit.completed;
  const updated = await db.habit.update({
    where: { id },
    data: { completed },
  });

  // Only change points when the completion state actually flips
  if (completed && !wasCompleted) {
    await db.attribute.updateMany({
      where: { userId: habit.userId, key: "consistency" },
      data: { points: { increment: habit.rewardPoints } },
    });
  } else if (!completed && wasCompleted) {
    await db.attribute.updateMany({
      where: { userId: habit.userId, key: "consistency" },
      data: { points: { decrement: habit.rewardPoints } },
    });
  }

  const consistency = await db.attribute.findFirst({
    where: { userId: habit.userId, key: "consistency" },
  });

  return NextResponse.json({
    id: updated.id,
    completed: updated.completed,
    rewardPoints: updated.rewardPoints,
    consistencyPoints: consistency?.points ?? 0,
  });
}
