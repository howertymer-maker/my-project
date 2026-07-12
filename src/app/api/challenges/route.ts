import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CATEGORY_ORDER } from "@/lib/mission-templates";

export const dynamic = "force-dynamic";

const DAILY_POINTS = 50;
const WEEKLY_POINTS = 300;

const DAILY_TITLES = [
  "Напиши старому другу сегодня",
  "Сделай 20 отжиманий прямо сейчас",
  "Прочти 10 страниц книги",
  "Выпей 2 стакана воды",
  "Помедитируй 5 минут",
  "Запиши 3 благодарности",
  "Сделай комплимент незнакомцу",
  "Прогуляйся 15 минут без телефона",
];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function weekStartStr() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return monday.toISOString().slice(0, 10);
}

export async function GET() {
  const user = await db.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const today = todayStr();
  const weekStart = weekStartStr();

  // get-or-create today's daily challenge
  let daily = await db.dailyChallenge.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
  });
  if (!daily) {
    const cat = CATEGORY_ORDER[Math.floor(Math.random() * CATEGORY_ORDER.length)];
    const title = DAILY_TITLES[Math.floor(Math.random() * DAILY_TITLES.length)];
    daily = await db.dailyChallenge.create({
      data: { userId: user.id, date: today, category: cat, title, points: DAILY_POINTS },
    });
  }

  // get-or-create this week's weekly challenge
  let weekly = await db.weeklyChallenge.findUnique({
    where: { userId_weekStart: { userId: user.id, weekStart } },
  });
  if (!weekly) {
    const cat = CATEGORY_ORDER[Math.floor(Math.random() * CATEGORY_ORDER.length)];
    weekly = await db.weeklyChallenge.create({
      data: {
        userId: user.id,
        weekStart,
        category: cat,
        title: `Неделя ${cat}: доведи навык до нового уровня`,
        points: WEEKLY_POINTS,
      },
    });
  }

  return NextResponse.json({
    daily: {
      id: daily.id,
      date: daily.date,
      category: daily.category,
      title: daily.title,
      points: daily.points,
      completed: daily.completed,
    },
    weekly: {
      id: weekly.id,
      weekStart: weekly.weekStart,
      category: weekly.category,
      title: weekly.title,
      points: weekly.points,
      completed: weekly.completed,
    },
  });
}

// complete a challenge: award points to the challenge's category skill
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, id } = body as { type: "daily" | "weekly"; id?: string };

  const user = await db.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (type === "daily") {
    const challenge = id
      ? await db.dailyChallenge.findUnique({ where: { id } })
      : await db.dailyChallenge.findUnique({
          where: { userId_date: { userId: user.id, date: todayStr() } },
        });
    if (!challenge || challenge.userId !== user.id) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }
    if (challenge.completed) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }
    await db.attribute.updateMany({
      where: { userId: user.id, key: challenge.category },
      data: { points: { increment: challenge.points } },
    });
    const updated = await db.dailyChallenge.update({
      where: { id: challenge.id },
      data: { completed: true, completedAt: new Date() },
    });
    return NextResponse.json({
      completed: true,
      pointsAwarded: updated.points,
      skillKey: updated.category,
    });
  }

  if (type === "weekly") {
    const challenge = id
      ? await db.weeklyChallenge.findUnique({ where: { id } })
      : await db.weeklyChallenge.findUnique({
          where: { userId_weekStart: { userId: user.id, weekStart: weekStartStr() } },
        });
    if (!challenge || challenge.userId !== user.id) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }
    if (challenge.completed) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }
    await db.attribute.updateMany({
      where: { userId: user.id, key: challenge.category },
      data: { points: { increment: challenge.points } },
    });
    const updated = await db.weeklyChallenge.update({
      where: { id: challenge.id },
      data: { completed: true, completedAt: new Date() },
    });
    return NextResponse.json({
      completed: true,
      pointsAwarded: updated.points,
      skillKey: updated.category,
    });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
