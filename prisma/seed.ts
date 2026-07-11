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
  await db.missionLog.deleteMany();
  await db.mission.deleteMany();
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

  // ===== Missions =====
  // Missions award points to one of the 6 mission-driven skills (by category)
  const missions = [
    {
      title: "Пробежать 50 км за месяц",
      description: "Накопительный километраж бега. Прокачивает выносливость и физический атрибут.",
      category: "physical", difficulty: "elite", xp: 1200, duration: "30 ДНЕЙ", progress: 64, completed: false, accentColor: "#3b82f6", icon: "directions_run", sortOrder: 0,
    },
    {
      title: "50 часов глубокого фокуса",
      description: "Глубокая работа без отвлечений. Развивает ментальный атрибут и дисциплину.",
      category: "mental", difficulty: "legendary", xp: 2400, duration: "30 ДНЕЙ", progress: 38, completed: false, accentColor: "#22c55e", icon: "psychology", sortOrder: 1,
    },
    {
      title: "10 новых знакомств",
      description: "Расширь социальный круг. Каждая осмысленная беседа засчитывается.",
      category: "social", difficulty: "recruit", xp: 600, duration: "14 ДНЕЙ", progress: 70, completed: false, accentColor: "#eab308", icon: "forum", sortOrder: 2,
    },
    {
      title: "Накопить резерв 100k",
      description: "Сформируй финансовую подушку. Прокачивает финансовый атрибут.",
      category: "financial", difficulty: "elite", xp: 1800, duration: "90 ДНЕЙ", progress: 52, completed: false, accentColor: "#a855f7", icon: "payments", sortOrder: 3,
    },
    {
      title: "45 дней без сахара",
      description: "Челлендж дисциплины. Усиливает контроль и физическое здоровье.",
      category: "discipline", difficulty: "legendary", xp: 3000, duration: "45 ДНЕЙ", progress: 27, completed: false, accentColor: "#f97316", icon: "fitness_center", sortOrder: 4,
    },
    {
      title: "Утренняя рутина 21 день",
      description: "Стабильный подъём в 6:00 с ритуалом. Закрепляет дисциплину.",
      category: "discipline", difficulty: "recruit", xp: 800, duration: "21 ДЕНЬ", progress: 100, completed: true, accentColor: "#b6f700", icon: "wb_sunny", sortOrder: 5,
    },
    {
      title: "Сертификация по специальности",
      description: "Пройди онлайн-курс и получи сертификат. Прокачивает ментал и финансы.",
      category: "mental", difficulty: "elite", xp: 2000, duration: "60 ДНЕЙ", progress: 15, completed: false, accentColor: "#e9b3ff", icon: "school", sortOrder: 6,
    },
  ];
  for (const m of missions) {
    await db.mission.create({ data: m });
  }

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
