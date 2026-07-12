import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { DEFAULT_HABITS } from "@/lib/default-habits";

export const dynamic = "force-dynamic";

// Default 7 skills created for every new user (6 mission-driven + 1 habit-driven)
const DEFAULT_SKILLS = [
  { key: "discipline", label: "Дисциплина", icon: "fitness_center", color: "#f97316", source: "missions", points: 0, sortOrder: 0 },
  { key: "social", label: "Социальность", icon: "forum", color: "#eab308", source: "missions", points: 0, sortOrder: 1 },
  { key: "mental", label: "Ментал", icon: "psychology", color: "#22c55e", source: "missions", points: 0, sortOrder: 2 },
  { key: "physical", label: "Физика", icon: "directions_run", color: "#3b82f6", source: "missions", points: 0, sortOrder: 3 },
  { key: "financial", label: "Финансы", icon: "payments", color: "#a855f7", source: "missions", points: 0, sortOrder: 4 },
  { key: "appearance", label: "Внешность", icon: "face", color: "#ec4899", source: "missions", points: 0, sortOrder: 5 },
  { key: "consistency", label: "Дисциплинированность", icon: "autorenew", color: "#fbbf24", source: "habits", points: 0, sortOrder: 6 },
];

// 20 default habits are imported at the top of this file (DEFAULT_HABITS).

export async function POST(req: NextRequest) {
  const { email, password, displayName } = await req.json();

  if (!email || !password || !displayName) {
    return NextResponse.json(
      { error: "Email, пароль и имя обязательны" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Пароль минимум 6 символов" },
      { status: 400 }
    );
  }

  const normalized = email.toLowerCase().trim();
  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) {
    return NextResponse.json(
      { error: "Email уже зарегистрирован" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email: normalized,
      passwordHash,
      displayName: displayName.trim(),
      onboarded: true,
    },
  });

  // Onboarding: create the 7 default skills
  for (const s of DEFAULT_SKILLS) {
    await db.attribute.create({ data: { ...s, userId: user.id } });
  }

  // Onboarding: create starter habits
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  for (const h of DEFAULT_HABITS) {
    await db.habit.create({
      data: {
        ...h,
        completed: false,
        streak: 0,
        weekStart: weekStartStr,
        subtasksTotal: 0,
        subtasksDone: 0,
        userId: user.id,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, displayName: user.displayName },
  });
}
