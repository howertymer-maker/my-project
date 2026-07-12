import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";
import { DEFAULT_HABITS, DEMO_HABIT_STATE } from "../src/lib/default-habits";

// Seed demo accounts + community posts so the feed isn't empty for new users.
// Each new real user gets their own skills/habits via the register API onboarding.

const DEMO_USERS = [
  {
    email: "adrian@demo.app",
    displayName: "Adrián Gavalyan",
    password: "demo1234",
    rankTitle: "Подписатель II",
  },
  {
    email: "max@demo.app",
    displayName: "Max Thompson",
    password: "demo1234",
    rankTitle: "Новичок I",
  },
  {
    email: "samir@demo.app",
    displayName: "Samir Patel",
    password: "demo1234",
    rankTitle: "Endeavorer",
  },
  {
    email: "lena@demo.app",
    displayName: "Lena Kowalski",
    password: "demo1234",
    rankTitle: "Архитектор III",
  },
];

async function main() {
  // Clean
  await db.skillHistory.deleteMany();
  await db.notification.deleteMany();
  await db.postLike.deleteMany();
  await db.comment.deleteMany();
  await db.post.deleteMany();
  await db.cooldownCheckin.deleteMany();
  await db.weeklyChallenge.deleteMany();
  await db.dailyChallenge.deleteMany();
  await db.userMission.deleteMany();
  await db.habit.deleteMany();
  await db.attribute.deleteMany();
  await db.user.deleteMany();

  // create demo users
  const created = [];
  for (const du of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(du.password, 10);
    const u = await db.user.create({
      data: {
        email: du.email,
        passwordHash,
        displayName: du.displayName,
        rankTitle: du.rankTitle,
        onboarded: true,
      },
    });
    created.push(u);
  }
  const [adrian, max, samir, lena] = created;

  // ===== Give the primary demo user (adrian) a full set of skills, habits and
  // a completed mission so the app looks alive when browsed without auth (bypass).
  const SKILLS = [
    { key: "discipline", label: "Дисциплина", icon: "fitness_center", color: "#f97316", source: "missions", points: 6800, sortOrder: 0 },
    { key: "social", label: "Социальность", icon: "forum", color: "#eab308", source: "missions", points: 7400, sortOrder: 1 },
    { key: "mental", label: "Ментал", icon: "psychology", color: "#22c55e", source: "missions", points: 7700, sortOrder: 2 },
    { key: "physical", label: "Физика", icon: "directions_run", color: "#3b82f6", source: "missions", points: 4600, sortOrder: 3 },
    { key: "financial", label: "Финансы", icon: "payments", color: "#a855f7", source: "missions", points: 7200, sortOrder: 4 },
    { key: "appearance", label: "Внешность", icon: "face", color: "#ec4899", source: "missions", points: 5800, sortOrder: 5 },
    { key: "consistency", label: "Дисциплинированность", icon: "autorenew", color: "#fbbf24", source: "habits", points: 4200, sortOrder: 6 },
  ];
  for (const s of SKILLS) {
    await db.attribute.create({ data: { ...s, userId: adrian.id } });
  }

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  for (const h of DEFAULT_HABITS) {
    const st = DEMO_HABIT_STATE[h.title] ?? { completed: false, streak: 0 };
    await db.habit.create({
      data: {
        title: h.title,
        category: h.category,
        color: h.color,
        target: h.target,
        rewardPoints: h.rewardPoints,
        completed: st.completed,
        streak: st.streak,
        subtasksTotal: 0,
        subtasksDone: 0,
        weekStart: weekStartStr,
        userId: adrian.id,
      },
    });
  }

  // one completed mission in discipline (cooldown expired) + one in physical (cooldown active)
  const now = new Date();
  const ago8d = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
  const ago1h = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  await db.userMission.create({
    data: {
      userId: adrian.id,
      templateId: "discipline-0",
      category: "discipline",
      currentStage: 3,
      stageStartedAt: new Date(ago8d.getTime() - 96 * 60 * 60 * 1000),
      completedAt: ago8d,
      nextAvailableAt: ago8d,
    },
  });
  await db.userMission.create({
    data: {
      userId: adrian.id,
      templateId: "physical-0",
      category: "physical",
      currentStage: 3,
      stageStartedAt: new Date(ago1h.getTime() - 96 * 60 * 60 * 1000),
      completedAt: ago1h,
      nextAvailableAt: in7d,
    },
  });
  // one in-progress mission (discipline-1, stage 1 ready)
  const ago25h = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  await db.userMission.create({
    data: {
      userId: adrian.id,
      templateId: "discipline-1",
      category: "discipline",
      currentStage: 1,
      stageStartedAt: ago25h,
    },
  });

  // ===== demo skill history for adrian (6 months of daily snapshots) =====
  // Generates realistic-looking growth from 0 to 43700 over ~180 days
  const finalPoints = 43700;
  const days = 180;
  for (let d = days; d >= 0; d--) {
    const date = new Date(Date.now() - d * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().slice(0, 10);
    // exponential growth: start near 0, end at finalPoints
    const progress = (days - d) / days; // 0 → 1
    const points = Math.round(finalPoints * Math.pow(progress, 1.5));
    await db.skillHistory.create({
      data: { userId: adrian.id, date: dateStr, totalPoints: points },
    }).catch(() => {}); // ignore duplicates
  }

  // ===== demo notifications for adrian so the notifications tab isn't empty =====
  const notifs = [
    { type: "streak", icon: "local_fire_department", color: "#f97316", title: "Серия под угрозой!", body: "Серия «Медитация» (14 дней) прервётся, если не отметишь привычку сегодня.", read: false, minsAgo: 5 },
    { type: "mission", icon: "rocket_launch", color: "#00f2ff", title: "Этап миссии готов к завершению", body: "«Управление временем» — этап 1 выполнен. Получи +240 очк к Дисциплине.", read: false, minsAgo: 60 },
    { type: "reward", icon: "trending_up", color: "#b6f700", title: "Новый уровень навыка!", body: "Поздравляем! «Ментал» достиг 8-го уровня. Продолжай в том же духе.", read: false, minsAgo: 180 },
    { type: "social", icon: "thumb_up", color: "#e9b3ff", title: "Новый лайк на пост", body: "Samir Patel оценил ваш пост «Как я закрыла финансовую миссию».", read: false, minsAgo: 300 },
    { type: "challenge", icon: "today", color: "#00f2ff", title: "Ежедневный челлендж доступен", body: "Напиши старому другу сегодня и получи +50 очк к Социальности.", read: true, minsAgo: 480 },
    { type: "social", icon: "chat_bubble", color: "#e9b3ff", title: "Новый комментарий", body: "Lena Kowalski: «Отличный совет, попробую сегодня!» под вашим постом.", read: true, minsAgo: 720 },
    { type: "system", icon: "diamond", color: "#fbbf24", title: "Премиум-предложение", body: "Оформи премиум и получи мгновенный доступ ко всем 48 миссиям.", read: true, minsAgo: 1440 },
    { type: "reward", icon: "bolt", color: "#b6f700", title: "Бонус за все привычки!", body: "Ты выполнил все 20 привычек за день. +300 очк к Дисциплинированности.", read: true, minsAgo: 1440 },
  ];
  for (const n of notifs) {
    await db.notification.create({
      data: {
        userId: adrian.id,
        type: n.type,
        icon: n.icon,
        color: n.color,
        title: n.title,
        body: n.body,
        read: n.read,
        createdAt: new Date(Date.now() - n.minsAgo * 60 * 1000),
      },
    });
  }

  // demo community posts (owned by the demo authors)
  const posts = [
    {
      authorId: adrian.id,
      authorName: adrian.displayName,
      authorBadge: "Подписатель II",
      category: "physical",
      categoryLabel: "ФИЗИЧЕСКОЕ РАЗВИТИЕ",
      xpReward: 120,
      title: "Начало всего",
      body: "Я новичок в этом приложении, и оно мне очень нравится. Обычно такие приложения кажутся слишком сложными, но здесь всё разложено по полочкам — навыки, миссии, привычки. Уже за первую неделю понял, где мои слабые места. Физика проседает сильнее всего, начинаю с малого — прогулки и сон.",
      likes: 74,
      isAdvice: false,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      authorId: max.id,
      authorName: max.displayName,
      authorBadge: "Новичок I",
      category: "advice",
      categoryLabel: "СОВЕТЫ",
      xpReward: 0,
      title: "Нужен узкоспециализированный совет",
      body: "Привет, ребята, давайте расти вместе. Мне нужна помощь. Нужен друг, который научит меня оптимизировать график сна. Я усердно тренируюсь в зале, но восстановление хромает. Есть элитные советы по фазам сна и вечерним ритуалам?",
      likes: 91,
      isAdvice: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      authorId: samir.id,
      authorName: samir.displayName,
      authorBadge: "Endeavorer",
      category: "mental",
      categoryLabel: "МЕНТАЛЬНОЕ РАЗВИТИЕ",
      xpReward: 240,
      title: "Достиг легендарной серии 90 дней медитации",
      body: "Сегодня закрыл 90-дневный челлендж медитации. Главный инсайт: дисциплина важнее мотивации. Поначалу было тяжело, но система удержания привычек в Neon Protocol держала меня в тонусе. Ментал подскочил с 5.1 до 8.3. Всем, кто сомневается — просто начните.",
      likes: 312,
      isAdvice: false,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      authorId: lena.id,
      authorName: lena.displayName,
      authorBadge: "Архитектор III",
      category: "financial",
      categoryLabel: "ФИНАНСОВОЕ РАЗВИТИЕ",
      xpReward: 180,
      title: "Как я закрыла финансовую миссию за 60 дней",
      body: "Делись пошаговым планом: 1) зафиксировала все траты, 2) отложила 20% с каждого поступления, 3) убрала импульсивные покупки. Результат — резерв сформирован, стресс снизился. Финансы 7.2 → 8.9.",
      likes: 156,
      isAdvice: false,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ];
  for (const p of posts) {
    await db.post.create({
      data: {
        ...p,
        commentsCount: 0,
      },
    });
  }

  console.log(`Seed complete: ${created.length} demo users + ${posts.length} posts`);
  console.log("Demo logins: adrian@demo.app / demo1234, max@demo.app / demo1234, etc.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
