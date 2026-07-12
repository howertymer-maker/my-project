import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { notify } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Streak multiplier (Proposal 2): base × (1 + min(streak,14)/14), cap ×2 at 14 days
export function streakMultiplier(streak: number): number {
  return 1 + Math.min(streak, 14) / 14;
}

// Effective reward = base rewardPoints × streak multiplier
export function effectiveReward(basePoints: number, streak: number): number {
  return Math.round(basePoints * streakMultiplier(streak));
}

// Bonus for completing ALL habits in a day (Proposal 3)
const ALL_HABITS_BONUS = 300;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habits = await db.habit.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const consistency = await db.attribute.findFirst({
    where: { userId: user.id, key: "consistency" },
  });

  const allDone = habits.length > 0 && habits.every((h) => h.completed);
  const bonusToday =
    user.lastAllHabitsBonusAt &&
    user.lastAllHabitsBonusAt.toISOString().slice(0, 10) === todayStr();

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
      effectiveReward: effectiveReward(h.rewardPoints, h.streak),
      streakMult: streakMultiplier(h.streak),
      subtasksTotal: h.subtasksTotal,
      subtasksDone: h.subtasksDone,
    })),
    streakDays: 14,
    consistencyPoints: consistency?.points ?? 0,
    allHabitsDone: allDone,
    allHabitsBonusClaimed: !!bonusToday,
    allHabitsBonus: ALL_HABITS_BONUS,
  });
}

// Toggling a habit awards/withdraws points to the 7th skill ("Дисциплинированность")
// Reward = base × streak multiplier (Proposal 2). If all habits are now done and
// the daily bonus hasn't been claimed yet, award +300 (Proposal 3).
export async function PATCH(req: NextRequest) {
  const { id, completed } = await req.json();

  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habit = await db.habit.findUnique({ where: { id } });
  if (!habit || habit.userId !== sessionUser.id) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }

  const wasCompleted = habit.completed;
  const updated = await db.habit.update({
    where: { id },
    data: { completed },
  });

  // Effective reward uses the streak multiplier at the moment of completion
  const reward = effectiveReward(habit.rewardPoints, habit.streak);

  if (completed && !wasCompleted) {
    await db.attribute.updateMany({
      where: { userId: habit.userId, key: "consistency" },
      data: { points: { increment: reward } },
    });
  } else if (!completed && wasCompleted) {
    await db.attribute.updateMany({
      where: { userId: habit.userId, key: "consistency" },
      data: { points: { decrement: reward } },
    });
  }

  // Proposal 3: bonus for completing ALL habits today (only on the completing toggle)
  let bonusAwarded = false;
  if (completed && !wasCompleted) {
    const user = await db.user.findUnique({ where: { id: habit.userId } });
    if (user) {
      const today = todayStr();
      const alreadyBonus =
        user.lastAllHabitsBonusAt &&
        user.lastAllHabitsBonusAt.toISOString().slice(0, 10) === today;
      if (!alreadyBonus) {
        const allHabits = await db.habit.findMany({
          where: { userId: user.id },
        });
        if (allHabits.length > 0 && allHabits.every((h) => h.completed)) {
          // capture level before bonus to detect level-up
          const before = await db.attribute.findFirst({
            where: { userId: user.id, key: "consistency" },
          });
          const lvlBefore = before ? Math.floor(before.points / 1000) : 0;

          await db.attribute.updateMany({
            where: { userId: user.id, key: "consistency" },
            data: { points: { increment: ALL_HABITS_BONUS } },
          });
          await db.user.update({
            where: { id: user.id },
            data: { lastAllHabitsBonusAt: new Date() },
          });
          bonusAwarded = true;

          // bonus notification
          await notify({
            userId: user.id,
            type: "reward",
            icon: "bolt",
            color: "#b6f700",
            title: "Бонус за все привычки!",
            body: `Ты выполнил все ${allHabits.length} привычек за день. +${ALL_HABITS_BONUS} очк к Дисциплинированности.`,
          });

          // level-up notification for consistency
          const after = await db.attribute.findFirst({
            where: { userId: user.id, key: "consistency" },
          });
          const lvlAfter = after ? Math.floor(after.points / 1000) : 0;
          if (lvlAfter > lvlBefore) {
            await notify({
              userId: user.id,
              type: "reward",
              icon: "trending_up",
              color: "#fbbf24",
              title: "Дисциплинированность повышено!",
              body: `Навык «Дисциплинированность» достиг ${lvlAfter}-го уровня.`,
            });
          }
        }
      }
    }
  }

  const consistency = await db.attribute.findFirst({
    where: { userId: habit.userId, key: "consistency" },
  });

  return NextResponse.json({
    id: updated.id,
    completed: updated.completed,
    rewardPoints: updated.rewardPoints,
    effectiveReward: reward,
    streakMult: streakMultiplier(updated.streak),
    consistencyPoints: consistency?.points ?? 0,
    allHabitsBonusAwarded: bonusAwarded,
    allHabitsBonus: ALL_HABITS_BONUS,
  });
}
