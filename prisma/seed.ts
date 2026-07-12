import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

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
