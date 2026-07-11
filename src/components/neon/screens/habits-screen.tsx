"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Rewards = {
  discipline: number;
  social: number;
  mental: number;
  physical: number;
  financial: number;
  appearance: number;
};

type Habit = {
  id: string;
  title: string;
  category: string;
  color: string;
  target: string;
  completed: boolean;
  streak: number;
  weekStart: string;
  rewards: Rewards;
  subtasksTotal: number;
  subtasksDone: number;
};

type HabitsData = {
  habits: Habit[];
  streakDays: number;
};

const CATEGORY_LABEL: Record<string, string> = {
  physical: "Физические",
  mental: "Ментальные",
  social: "Социальные",
  financial: "Финансовые",
  discipline: "Дисциплина",
  appearance: "Внешность",
};

const REWARD_META: { key: keyof Rewards; color: string }[] = [
  { key: "discipline", color: "#f97316" },
  { key: "social", color: "#eab308" },
  { key: "mental", color: "#22c55e" },
  { key: "physical", color: "#3b82f6" },
  { key: "financial", color: "#a855f7" },
  { key: "appearance", color: "#ec4899" },
];

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function HabitsScreen() {
  const { data, loading } = useApi<HabitsData>("/api/habits");
  const [filter, setFilter] = useState<"all" | "physical">("all");

  if (loading || !data) {
    return <HabitsSkeleton />;
  }

  const todayIdx = new Date().getDay();
  const habits = data.habits.filter(
    (h) => filter === "all" || h.category === "physical"
  );
  const completedCount = habits.filter((h) => h.completed).length;

  return (
    <div className="flex flex-col gap-5 pt-4">
      {/* Title */}
      <section className="flex items-center gap-3">
        <span className="text-primary-container">
          <MaterialIcon name="check_circle" size={28} fill />
        </span>
        <div className="flex flex-col">
          <h1 className="font-display text-2xl font-bold text-on-surface leading-none">
            Привычки
          </h1>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">
            Персонально для вас
          </span>
        </div>
      </section>

      {/* Date nav */}
      <section className="flex items-center justify-between bg-surface-container/60 backdrop-blur-md rounded-xl px-3 py-2.5 border border-outline-variant/30">
        <button
          className="w-8 h-8 grid place-items-center rounded-md text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors"
          aria-label="Предыдущий день"
        >
          <MaterialIcon name="chevron_left" size={20} />
        </button>
        <div className="flex items-center gap-2">
          <MaterialIcon name="calendar_today" size={16} className="text-primary-fixed-dim" />
          <span className="font-mono text-[13px] text-on-surface font-medium">
            {formatToday()}
          </span>
        </div>
        <button
          className="w-8 h-8 grid place-items-center rounded-md text-on-surface-variant hover:text-primary-container hover:bg-surface-container-high transition-colors"
          aria-label="Следующий день"
        >
          <MaterialIcon name="chevron_right" size={20} />
        </button>
      </section>

      {/* Tabs + streak badge */}
      <section className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-surface-container/60 rounded-lg p-1 border border-outline-variant/30">
          {(["all", "physical"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "font-display text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md transition-colors",
                filter === f
                  ? "bg-primary-container text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {f === "all" ? "Все" : "Физические"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-secondary-fixed/15 border border-secondary-fixed/40 rounded-full px-2.5 py-1">
          <MaterialIcon name="local_fire_department" size={14} className="text-secondary-fixed" fill />
          <span className="font-mono text-[10px] text-secondary-fixed uppercase tracking-wider font-medium">
            Серия: {data.streakDays} дней
          </span>
        </div>
      </section>

      {/* Habit cards */}
      <section className="flex flex-col gap-3">
        {habits.map((h, i) => (
          <HabitCard key={h.id} habit={h} index={i} />
        ))}
        {habits.length === 0 && (
          <div className="glass-panel rounded-xl p-8 text-center text-on-surface-variant font-mono text-sm">
            Нет привычек в этой категории
          </div>
        )}
      </section>

      {/* Weekly overview */}
      <section className="glass-panel rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MaterialIcon name="calendar_view_week" size={18} className="text-primary-fixed-dim" />
            <h3 className="font-display text-base font-bold text-on-surface">
              Обзор за неделю
            </h3>
          </div>
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            {completedCount}/{habits.length} сегодня
          </span>
        </div>
        <div className="flex justify-between gap-1.5">
          {WEEKDAYS.map((d, i) => {
            const isToday = i === todayIdx;
            const done = i < todayIdx || (isToday && completedCount > 0);
            return (
              <div
                key={d}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg border transition-colors",
                  isToday
                    ? "bg-primary-container/15 border-primary-container/50"
                    : "bg-surface-container/40 border-outline-variant/20"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-wider",
                    isToday ? "text-primary-fixed" : "text-on-surface-variant"
                  )}
                >
                  {d}
                </span>
                <div
                  className="w-6 h-6 rounded-full grid place-items-center"
                  style={
                    done
                      ? {
                          background: "rgba(182,247,0,0.15)",
                          boxShadow: "0 0 10px rgba(182,247,0,0.3)",
                        }
                      : { background: "rgba(255,255,255,0.04)" }
                  }
                >
                  {done && (
                    <MaterialIcon
                      name="check"
                      size={14}
                      className="text-secondary-fixed"
                      weight={700}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function HabitCard({ habit, index }: { habit: Habit; index: number }) {
  const [completed, setCompleted] = useState(habit.completed);
  const [holding, setHolding] = useState(false);

  const toggle = async () => {
    const next = !completed;
    setCompleted(next);
    try {
      await fetch("/api/habits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: habit.id, completed: next }),
      });
    } catch {
      setCompleted(!next);
    }
  };

  const rewards = REWARD_META.filter((r) => habit.rewards[r.key] > 0);

  return (
    <div
      className="glass-panel rounded-xl p-4 flex flex-col gap-3 animate-fade-in-up relative overflow-hidden"
      style={{
        animationDelay: `${index * 0.06}s`,
        opacity: 0,
        borderColor: `${habit.color}33`,
      }}
    >
      {/* accent left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: habit.color, boxShadow: `0 0 12px ${habit.color}` }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <h3
            className="font-display text-base font-bold leading-tight truncate"
            style={{ color: completed ? habit.color : "#e5e2e3" }}
          >
            {habit.title}
            {habit.target && (
              <span className="font-mono text-[12px] text-on-surface-variant font-normal ml-1.5">
                {habit.target}
              </span>
            )}
          </h3>
          {habit.subtasksTotal > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-on-surface-variant">
                {habit.subtasksTotal}/{habit.subtasksTotal}
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant">·</span>
              <span className="font-mono text-[10px] text-on-surface-variant">
                {habit.subtasksDone}/2 подзадач
              </span>
            </div>
          )}
        </div>
        <button
          onClick={toggle}
          onMouseDown={() => setHolding(true)}
          onMouseUp={() => setHolding(false)}
          onMouseLeave={() => setHolding(false)}
          className="shrink-0 w-9 h-9 rounded-full grid place-items-center border-2 transition-all active:scale-90"
          style={{
            borderColor: habit.color,
            background: completed ? habit.color : "transparent",
            boxShadow: completed ? `0 0 16px ${habit.color}99` : "none",
            color: completed ? "#0A0A0B" : habit.color,
          }}
          aria-label={completed ? "Отметить невыполненным" : "Отметить выполненным"}
        >
          <MaterialIcon name="check" size={20} weight={700} fill={completed} />
        </button>
      </div>

      {/* rewards */}
      {rewards.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {rewards.map((r) => (
            <span
              key={r.key}
              className="font-mono text-[11px] font-medium px-1.5 py-0.5 rounded"
              style={{ color: r.color, background: `${r.color}1a` }}
            >
              +{habit.rewards[r.key].toFixed(2)}
            </span>
          ))}
        </div>
      )}

      {/* footer: streak + date range */}
      <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
        <div className="flex items-center gap-1.5">
          <MaterialIcon name="date_range" size={13} className="text-on-surface-variant" />
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            {formatWeekRange(habit.weekStart)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MaterialIcon name="bolt" size={13} className="text-secondary-fixed-dim" fill />
          <span className="font-mono text-[10px] text-secondary-fixed-dim uppercase tracking-wider font-medium">
            серия {habit.streak} дн
          </span>
        </div>
      </div>

      {holding && !completed && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-container animate-pulse" />
      )}
    </div>
  );
}

function formatToday(): string {
  const d = new Date();
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];
  const ruMonths = [
    "фев", "мар", "апр", "май", "июн",
  ];
  void months;
  void ruMonths;
  const monthsRu = [
    "янв", "фев", "мар", "апр", "май", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек",
  ];
  return `${start.getDate()} ${monthsRu[start.getMonth()]} - ${end.getDate()} ${monthsRu[end.getMonth()]}`;
}

function HabitsSkeleton() {
  return (
    <div className="flex flex-col gap-5 pt-4 animate-pulse">
      <div className="h-8 w-48 rounded bg-surface-container-high" />
      <div className="h-12 rounded-xl bg-surface-container-high/60" />
      <div className="h-10 rounded-lg bg-surface-container-high/60" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-surface-container-high/60" />
      ))}
    </div>
  );
}
