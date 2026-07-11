import { db } from "../src/lib/db";

// ===== Skill system config =====
// 1000 points = 1 skill level (bar caps visually at level 10)
const POINTS_PER_LEVEL = 1000;

const SKILLS = [
  { key: "discipline", label: "Дисциплина", icon: "fitness_center", color: "#f97316", source: "missions", points: 6800, sortOrder: 0 },
  { key: "social", label: "Социальность", icon: "forum", color: "#eab308", source: "missions", points: 7400, sortOrder: 1 },
  { key: "mental", label: "Ментал", icon: "psychology", color: "#22c55e", source: "missions", points: 7700, sortOrder: 2 },
  { key: "physical", label: "Физика", icon: "directions_run", color: "#3b82f6", source: "missions", points: 4600, sortOrder: 3 },
  { key: "financial", label: "Финансы", icon: "payments", color: "#a855f7", source: "missions", points: 7200, sortOrder: 4 },
  { key: "appearance", label: "Внешность", icon: "face", color: "#ec4899", source: "missions", points: 5800, sortOrder: 5 },
  // 7th skill — leveled EXCLUSIVELY by habits
  { key: "consistency", label: "Постоянство", icon: "autorenew", color: "#fbbf24", source: "habits", points: 4200, sortOrder: 6 },
];

async function main() {
  // Clean
  await db.postLike.deleteMany();
  await db.comment.deleteMany();
  await db.post.deleteMany();
  await db.userMission.deleteMany();
  await db.habit.deleteMany();
  await db.attribute.deleteMany();
  await db.user.deleteMany();

  // ===== User (level derived from total skill points) =====
  const totalPoints = SKILLS.reduce((s, a) => s + a.points, 0);
  const user = await db.user.create({
    data: {
      displayName: "Endeavorise Eric",
      rankTitle: "Endeavorer",
      level: Math.floor(totalPoints / POINTS_PER_LEVEL),
      streakDays: 42,
      completionRate: 84,
      topPercent: 5,
      avatarUrl: null,
    },
  });

  // ===== Skills (6 mission-driven + 1 habit-driven "Постоянство") =====
  for (const a of SKILLS) {
    await db.attribute.create({ data: { ...a, userId: user.id } });
  }

  // ===== Habits =====
  // Habits award points ONLY to the 7th skill (consistency / "Постоянство")
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  const habits = [
    { title: "Тяжелая атлетика", category: "physical", color: "#00f2ff", target: "мин. 2д/н", completed: true, streak: 7, rewardPoints: 120 },
    { title: "Сон", category: "physical", color: "#22c55e", target: "мин. 7.5ч", completed: true, streak: 7, rewardPoints: 90 },
    { title: "Ставить цели с вечера", category: "mental", color: "#a855f7", target: "", completed: false, streak: 7, rewardPoints: 60, subtasksTotal: 7, subtasksDone: 1 },
    { title: "Медитация 10 минут", category: "mental", color: "#e9b3ff", target: "ежедневно", completed: true, streak: 14, rewardPoints: 75 },
    { title: "Чтение 30 страниц", category: "mental", color: "#22c55e", target: "каждый день", completed: false, streak: 5, rewardPoints: 80 },
    { title: "Прогулка на свежем воздухе", category: "physical", color: "#00f2ff", target: "мин. 8000 шагов", completed: true, streak: 3, rewardPoints: 65 },
  ];
  for (const h of habits) {
    await db.habit.create({
      data: {
        ...h,
        subtasksTotal: h.subtasksTotal ?? 0,
        subtasksDone: h.subtasksDone ?? 0,
        weekStart: weekStartStr,
        userId: user.id,
      },
    });
  }

  // ===== User mission instances (stages + timers) =====
  // Templates are static (src/lib/mission-templates.ts). Seed variety:
  //  - discipline-0 "Первый шаг к порядку": stage 1 started 25h ago → ready to complete
  //  - mental-0 "Пробуждение разума": completed 8 days ago → 7-day cooldown expired → mental-1 available
  //  - physical-0 "Пробуждение тела": completed 1 hour ago → 7-day cooldown ACTIVE → physical-1 locked
  const now = new Date();
  const ago25h = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  const ago8d = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
  const ago1h = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  await db.userMission.create({
    data: {
      userId: user.id,
      templateId: "discipline-0",
      category: "discipline",
      currentStage: 1,
      stageStartedAt: ago25h,
    },
  });

  await db.userMission.create({
    data: {
      userId: user.id,
      templateId: "mental-0",
      category: "mental",
      currentStage: 3,
      stageStartedAt: new Date(ago8d.getTime() - 96 * 60 * 60 * 1000),
      completedAt: ago8d,
      nextAvailableAt: ago8d, // premium-style instant (cooldown long expired either way)
    },
  });

  await db.userMission.create({
    data: {
      userId: user.id,
      templateId: "physical-0",
      category: "physical",
      currentStage: 3,
      stageStartedAt: new Date(ago1h.getTime() - 96 * 60 * 60 * 1000),
      completedAt: ago1h,
      nextAvailableAt: in7d, // 7-day cooldown active → physical-1 locked
    },
  });

  // ===== Community Posts =====
  const posts = [
    {
      authorName: "Adrián Gavalyan",
      authorBadge: "Подписатель II",
      category: "physical",
      categoryLabel: "ФИЗИЧЕСКОЕ РАЗВИТИЕ",
      xpReward: 120,
      title: "Начало всего",
      body: "Я новичок в этом приложении, и оно мне очень нравится. Обычно такие приложения кажутся слишком сложными, но здесь всё разложено по полочкам — навыки, миссии, привычки. Уже за первую неделю понял, где мои слабые места. Физика проседает сильнее всего, начинаю с малого — прогулки и сон.",
      likes: 74,
      commentsCount: 19,
      isAdvice: false,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      authorName: "Max Thompson",
      authorBadge: "Новичок I",
      category: "advice",
      categoryLabel: "СОВЕТЫ",
      xpReward: 0,
      title: "Нужен узкоспециализированный совет",
      body: "Привет, ребята, давайте расти вместе. Мне нужна помощь. Нужен друг, который научит меня оптимизировать график сна. Я усердно тренируюсь в зале, но восстановление хромает. Есть элитные советы по фазам сна и вечерним ритуалам?",
      likes: 91,
      commentsCount: 24,
      isAdvice: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      authorName: "Samir Patel",
      authorBadge: "Endeavorer",
      category: "mental",
      categoryLabel: "МЕНТАЛЬНОЕ РАЗВИТИЕ",
      xpReward: 240,
      title: "Достиг легендарной серии 90 дней медитации",
      body: "Сегодня закрыл 90-дневный челлендж медитации. Главный инсайт: дисциплина важнее мотивации. Поначалу было тяжело, но система удержания привычек в Neon Protocol держала меня в тонусе. Ментал подскочил с 5.1 до 8.3. Всем, кто сомневается — просто начните.",
      likes: 312,
      commentsCount: 47,
      isAdvice: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      authorName: "Lena Kowalski",
      authorBadge: "Архитектор III",
      category: "financial",
      categoryLabel: "ФИНАНСОВОЕ РАЗВИТИЕ",
      xpReward: 180,
      title: "Как я закрыла финансовую миссию за 60 дней",
      body: "Делись пошаговым планом: 1) зафиксировала все траты, 2) отложила 20% с каждого поступления, 3) убрала импульсивные покупки. Результат — резерв сформирован, стресс снизился. Финансы 7.2 → 8.9.",
      likes: 156,
      commentsCount: 33,
      isAdvice: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ];
  for (const p of posts) {
    const post = await db.post.create({ data: { ...p, authorId: user.id } });
    await db.comment.create({
      data: {
        postId: post.id,
        authorName: "Community Bot",
        body: "Отличный пост! Спасибо, что делитесь опытом.",
      },
    });
  }

  console.log("Seed complete. User:", user.id, "Total points:", totalPoints, "Level:", Math.floor(totalPoints / POINTS_PER_LEVEL));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
