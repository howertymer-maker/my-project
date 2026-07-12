// 20 default habits distributed across the 6 mission-driven categories.
// Each habit awards points to the 7th skill ("Дисциплинированность") on completion,
// with a streak multiplier applied at runtime (base × (1 + min(streak,14)/14)).
// Base rewards are tuned to the rebalanced economy (Proposal 4: −40% vs v1).

export type DefaultHabit = {
  title: string;
  category: string; // physical | mental | discipline | social | financial | appearance
  color: string; // hex accent for the card
  target: string; // e.g. "мин. 7.5ч"
  rewardPoints: number; // base reward (before streak multiplier)
  streak: number; // starting streak for the demo user (0 for new real users)
  completed?: boolean; // starting completion state for the demo user
  subtasksTotal?: number;
  subtasksDone?: number;
};

// Category color mapping (matches CATEGORY_META in mission-templates)
const C = {
  physical: "#00f2ff",
  mental: "#e9b3ff",
  discipline: "#f97316",
  social: "#eab308",
  financial: "#a855f7",
  appearance: "#ec4899",
};

// 20 habits — the full starter set every new user gets.
export const DEFAULT_HABITS: DefaultHabit[] = [
  // PHYSICAL (4)
  { title: "Сон", category: "physical", color: C.physical, target: "мин. 7.5ч", rewardPoints: 55 },
  { title: "Тяжелая атлетика", category: "physical", color: C.physical, target: "мин. 2д/н", rewardPoints: 75 },
  { title: "Прогулка на свежем воздухе", category: "physical", color: C.physical, target: "мин. 8000 шагов", rewardPoints: 40 },
  { title: "Водный баланс", category: "physical", color: "#22c55e", target: "2 литра/день", rewardPoints: 35 },

  // MENTAL (4)
  { title: "Медитация 10 минут", category: "mental", color: C.mental, target: "ежедневно", rewardPoints: 45 },
  { title: "Чтение 30 страниц", category: "mental", color: "#22c55e", target: "каждый день", rewardPoints: 50 },
  { title: "Изучение языка", category: "mental", color: C.mental, target: "15 минут/день", rewardPoints: 60 },
  { title: "Дневник благодарности", category: "mental", color: "#22c55e", target: "3 записи вечером", rewardPoints: 40 },

  // DISCIPLINE (3)
  { title: "Подъём по будильнику", category: "discipline", color: C.discipline, target: "без «ещё 5 мин»", rewardPoints: 55 },
  { title: "Глубокая работа", category: "discipline", color: C.discipline, target: "2ч без телефона", rewardPoints: 70 },
  { title: "Планирование завтра", category: "discipline", color: C.discipline, target: "3 задачи с вечера", rewardPoints: 35 },

  // SOCIAL (3)
  { title: "Связь с близкими", category: "social", color: C.social, target: "1 звонок/день", rewardPoints: 45 },
  { title: "Комплимент незнакомцу", category: "social", color: C.social, target: "1 раз/день", rewardPoints: 30 },
  { title: "Нет негативу в сети", category: "social", color: C.social, target: "0 токсичных комментов", rewardPoints: 40 },

  // FINANCIAL (3)
  { title: "Учёт трат", category: "financial", color: C.financial, target: "записать все расходы", rewardPoints: 45 },
  { title: "Откладывание 10%", category: "financial", color: C.financial, target: "от дохода/день", rewardPoints: 55 },
  { title: "Без импульсивных покупок", category: "financial", color: C.financial, target: "правило 24ч", rewardPoints: 35 },

  // APPEARANCE (3)
  { title: "Уход за кожей", category: "appearance", color: C.appearance, target: "утро + вечер", rewardPoints: 40 },
  { title: "Осанка", category: "appearance", color: C.appearance, target: "ровная спина", rewardPoints: 30 },
  { title: "Зарядка 10 минут", category: "appearance", color: C.appearance, target: "утром", rewardPoints: 45 },
];

// Demo overrides: which habits start completed and with which streak,
// so the preview looks alive (some done, some pending, varied streaks).
export const DEMO_HABIT_STATE: Record<string, { completed: boolean; streak: number }> = {
  "Сон": { completed: true, streak: 7 },
  "Тяжелая атлетика": { completed: true, streak: 7 },
  "Прогулка на свежем воздухе": { completed: true, streak: 3 },
  "Водный баланс": { completed: true, streak: 5 },
  "Медитация 10 минут": { completed: true, streak: 14 },
  "Чтение 30 страниц": { completed: false, streak: 5 },
  "Изучение языка": { completed: true, streak: 9 },
  "Дневник благодарности": { completed: false, streak: 2 },
  "Подъём по будильнику": { completed: true, streak: 6 },
  "Глубокая работа": { completed: true, streak: 4 },
  "Планирование завтра": { completed: false, streak: 7 },
  "Связь с близкими": { completed: true, streak: 8 },
  "Комплимент незнакомцу": { completed: false, streak: 1 },
  "Нет негативу в сети": { completed: true, streak: 11 },
  "Учёт трат": { completed: true, streak: 5 },
  "Откладывание 10%": { completed: true, streak: 12 },
  "Без импульсивных покупок": { completed: false, streak: 3 },
  "Уход за кожей": { completed: true, streak: 6 },
  "Осанка": { completed: false, streak: 2 },
  "Зарядка 10 минут": { completed: true, streak: 4 },
};
