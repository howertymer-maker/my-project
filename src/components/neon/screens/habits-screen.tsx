"use client";

import { useState } from "react";
import { useApi } from "@/hooks/use-api";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Habit = {
  id: string;
  title: string;
  category: string;
  color: string;
  target: string;
  completed: boolean;
  streak: number;
  weekStart: string;
  rewardPoints: number;
  effectiveReward: number; // base × streak multiplier
  streakMult: number;
  subtasksTotal: number;
  subtasksDone: number;
};

type HabitsData = {
  habits: Habit[];
  streakDays: number;
  consistencyPoints: number;
  allHabitsDone: boolean;
  allHabitsBonusClaimed: boolean;
  allHabitsBonus: number;
};

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const CONSISTENCY_COLOR = "#fbbf24";
const POINTS_PER_LEVEL = 1000;

export function HabitsScreen() {
  const { data, loading } = useApi<HabitsData>("/api/habits");
  const [filter, setFilter] = useState<"all" | "physical">("all");
  // live consistency points (updated on toggle)
  const [livePoints, setLivePoints] = useState<number | null>(null);

  if (loading || !data) {
    return <HabitsSkeleton />;
  }

  const todayIdx = new Date().getDay();
  const habits = data.habits.filter(
    (h) => filter === "all" || h.category === "physical"
  );
  const completedCount = data.habits.filter((h) => h.completed).length;
  const consistencyPoints = livePoints ?? data.consistencyPoints;
  const skillLevel = Math.floor(consistencyPoints / POINTS_PER_LEVEL);
  const pointsInLevel = consistencyPoints % POINTS_PER_LEVEL;
  const levelPercent = Math.round((pointsInLevel / POINTS_PER_LEVEL) * 100);

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

      {/* 7th skill live tracker — Дисциплинированность */}
      <section
        className="rounded-xl p-4 flex items-center gap-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(251,191,36,0.10), rgba(22,22,24,0.6))",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(251,191,36,0.30)",
        }}
      >
        <div
          aria-hidden
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-25 blur-3xl"
          style={{ background: CONSISTENCY_COLOR }}
        />
        <div
          className="shrink-0 w-12 h-12 rounded-lg grid place-items-center border relative"
          style={{
            background: `${CONSISTENCY_COLOR}1a`,
            borderColor: `${CONSISTENCY_COLOR}66`,
            color: CONSISTENCY_COLOR,
          }}
        >
          <MaterialIcon name="autorenew" size={26} fill />
        </div>
        <div className="flex-1 flex flex-col gap-1.5 relative min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <span className="font-display text-base font-bold text-on-surface leading-none">
                Дисциплинированность
              </span>
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">
                навык · ур. {skillLevel}
              </span>
            </div>
            <div className="flex items-baseline gap-1 shrink-0">
              <span
                className="font-display text-lg font-extrabold leading-none"
                style={{ color: CONSISTENCY_COLOR }}
              >
                {(POINTS_PER_LEVEL - pointsInLevel).toLocaleString("ru-RU")}
              </span>
              <span className="font-mono text-[9px] text-on-surface-variant">
                очк до ур. {skillLevel + 1}
              </span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full progress-bar-fill transition-all duration-500"
              style={{
                width: `${levelPercent}%`,
                background: CONSISTENCY_COLOR,
                color: CONSISTENCY_COLOR,
              }}
            />
          </div>
        </div>
      </section>

      {/* All-habits bonus banner (Proposal 3) */}
      <AllHabitsBonusBanner
        done={data.allHabitsDone}
        claimed={data.allHabitsBonusClaimed}
        bonus={data.allHabitsBonus}
        completedCount={data.habits.filter((h) => h.completed).length}
        total={data.habits.length}
      />

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
          <HabitCard
            key={h.id}
            habit={h}
            index={i}
            onPointsChange={(pts) => setLivePoints(pts)}
          />
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
            {completedCount}/{data.habits.length} сегодня
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

function HabitCard({
  habit,
  index,
  onPointsChange,
}: {
  habit: Habit;
  index: number;
  onPointsChange: (pts: number) => void;
}) {
  const [completed, setCompleted] = useState(habit.completed);
  const [holding, setHolding] = useState(false);

  const toggle = async () => {
    const next = !completed;
    setCompleted(next);
    try {
      const res = await fetch("/api/habits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: habit.id, completed: next }),
      });
      const json = await res.json();
      if (typeof json?.consistencyPoints === "number") {
        onPointsChange(json.consistencyPoints);
      }
    } catch {
      setCompleted(!next);
    }
  };

  return (
    <div
      className="glass-panel rounded-xl p-4 flex flex-col gap-3 animate-fade-in-up relative overflow-hidden"
      style={{
        animationDelay: `${index * 0.06}s`,
        opacity: 0,
        borderColor: `${habit.color}33`,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: habit.color, boxShadow: `0 0 12px ${habit.color}` }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <h3
            className="font-display text-base font-bold leading-tight break-words"
            style={{ color: completed ? habit.color : "#e5e2e3" }}
          >
            {habit.title}
          </h3>
          {habit.target && (
            <span className="font-mono text-[11px] text-on-surface-variant font-normal leading-snug">
              {habit.target}
            </span>
          )}
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

      {/* reward → points to Дисциплинированность (7th skill), with streak multiplier */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="flex items-center gap-1 font-mono text-[11px] font-medium px-1.5 py-0.5 rounded"
          style={{ color: CONSISTENCY_COLOR, background: `${CONSISTENCY_COLOR}1a` }}
        >
          <MaterialIcon name="autorenew" size={12} fill />
          +{habit.effectiveReward} очк
        </span>
        {habit.streakMult > 1 && (
          <span
            className="flex items-center gap-0.5 font-mono text-[10px] font-medium px-1.5 py-0.5 rounded"
            style={{ color: "#fbbf24", background: "rgba(251,191,36,0.12)" }}
          >
            <MaterialIcon name="local_fire_department" size={11} fill />
            ×{habit.streakMult.toFixed(2)}
          </span>
        )}
        <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider">
          → Дисциплинированность
        </span>
      </div>

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
      <div className="h-20 rounded-xl bg-surface-container-high/60" />
      <div className="h-12 rounded-xl bg-surface-container-high/60" />
      <div className="h-10 rounded-lg bg-surface-container-high/60" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-xl bg-surface-container-high/60" />
      ))}
    </div>
  );
}

/** Proposal 3: bonus banner for completing all habits in a day. */
function AllHabitsBonusBanner({
  done,
  claimed,
  bonus,
  completedCount,
  total,
}: {
  done: boolean;
  claimed: boolean;
  bonus: number;
  completedCount: number;
  total: number;
}) {
  if (claimed) {
    return (
      <div className="rounded-xl p-3 flex items-center gap-2.5 border bg-secondary-fixed/10 border-secondary-fixed/40">
        <MaterialIcon name="verified" size={20} className="text-secondary-fixed" fill />
        <p className="font-mono text-[11px] text-secondary-fixed leading-relaxed flex-1">
          Бонус +{bonus} очк получен! Все привычки выполнены сегодня.
        </p>
      </div>
    );
  }
  if (done) {
    return (
      <div
        className="rounded-xl p-3 flex items-center gap-2.5 border animate-neon-breath"
        style={{
          background: "linear-gradient(135deg, rgba(182,247,0,0.18), rgba(22,22,24,0.6))",
          borderColor: "rgba(182,247,0,0.5)",
        }}
      >
        <MaterialIcon name="celebration" size={20} className="text-secondary-fixed" fill />
        <p className="font-mono text-[11px] text-secondary-fixed leading-relaxed flex-1">
          Все {total} привычек выполнены! Бонус +{bonus} очк → Дисциплинированность.
        </p>
      </div>
    );
  }
  return (
    <div className="rounded-xl p-3 flex items-center gap-2.5 border border-outline-variant/30 bg-surface-container/40">
      <MaterialIcon name="emoji_events" size={20} className="text-on-surface-variant" fill />
      <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed flex-1">
        Выполни все {total} привычек — бонус +{bonus} очк к Дисциплинированности.
      </p>
      <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider shrink-0">
        {completedCount}/{total}
      </span>
    </div>
  );
}
