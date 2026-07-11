"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";
import { useCountdown, formatRemaining } from "@/hooks/use-countdown";
import {
  CATEGORY_META,
  DIFFICULTY_META,
  stageHours,
  stagePoints,
  stageTitle,
  type MissionTemplate,
} from "@/lib/mission-templates";

type MissionState = {
  userMissionId: string | null;
  started: boolean;
  currentStage: number;
  stageStartedAt: string | null;
  stageReady: boolean;
  completedAt: string | null;
  pointsEarned: number;
  cooldownUntil: string | null;
  cooldownActive: boolean;
};

type Props = {
  template: MissionTemplate;
  state: MissionState;
  index: number;
  premium?: boolean;
  onChanged: () => void;
};

export function MissionCard({ template, state, index, premium, onChanged }: Props) {
  const cat = CATEGORY_META[template.category];
  const diff = DIFFICULTY_META[template.difficulty];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allDone = state.completedAt === "all-done";
  const completed = !!state.completedAt && state.completedAt !== "all-done";

  const startMission = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", templateId: template.id }),
      });
      if (!res.ok) throw new Error("Не удалось начать");
      onChanged();
    } catch {
      setError("Ошибка старта");
    } finally {
      setBusy(false);
    }
  };

  const completeStage = async () => {
    if (!state.userMissionId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-stage",
          userMissionId: state.userMissionId,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Этап ещё выполняется");
      }
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="glass-panel rounded-xl p-4 flex flex-col gap-3 animate-fade-in-up relative overflow-hidden"
      style={{
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        borderColor: `${cat.color}33`,
      }}
    >
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-15 blur-2xl"
        style={{ background: cat.color }}
      />

      {/* header */}
      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="shrink-0 w-11 h-11 rounded-lg grid place-items-center border"
            style={{
              background: `${cat.color}1a`,
              borderColor: `${cat.color}55`,
              color: cat.color,
            }}
          >
            <MaterialIcon name={cat.icon} size={22} fill />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{ color: cat.color, background: `${cat.color}1a` }}
              >
                {cat.label}
              </span>
              <span
                className="font-mono text-[9px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{ color: diff.color, background: diff.bg }}
              >
                {diff.label}
              </span>
              {premium && (
                <span className="flex items-center gap-0.5 font-mono text-[9px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider text-amber-300 bg-amber-400/15">
                  <MaterialIcon name="diamond" size={10} fill />
                  Премиум
                </span>
              )}
            </div>
            <h3 className="font-display text-base font-bold text-on-surface leading-tight">
              {template.title}
            </h3>
            <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span
            className="font-display text-lg font-extrabold leading-none"
            style={{ color: cat.color }}
          >
            +{template.totalPoints}
          </span>
          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mt-0.5">
            очк
          </span>
          <span className="font-mono text-[8px] text-on-surface-variant mt-0.5">
            → {cat.skill}
          </span>
        </div>
      </div>

      {/* stages */}
      <div className="flex flex-col gap-2 relative">
        {[1, 2, 3].map((st) => (
          <StageRow
            key={st}
            template={template}
            stage={st}
            state={state}
            color={cat.color}
          />
        ))}
      </div>

      {/* action area */}
      {error && (
        <div className="font-mono text-[11px] text-error px-2 py-1 bg-error-container/30 rounded">
          {error}
        </div>
      )}

      {allDone ? (
        <div className="mt-1 w-full py-2.5 rounded-lg bg-secondary-fixed/15 text-secondary-fixed border border-secondary-fixed/40 font-display text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <MaterialIcon name="emoji_events" size={16} fill />
          Категория завершена
        </div>
      ) : completed ? (
        <div className="mt-1 w-full py-2.5 rounded-lg bg-secondary-fixed/15 text-secondary-fixed border border-secondary-fixed/40 font-display text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <MaterialIcon name="task_alt" size={16} fill />
          Миссия завершена · +{template.totalPoints} очк
        </div>
      ) : state.cooldownActive && state.cooldownUntil ? (
        <CooldownBanner
          until={state.cooldownUntil}
          color={cat.color}
        />
      ) : !state.started ? (
        <button
          onClick={startMission}
          disabled={busy}
          className="mt-1 w-full py-2.5 rounded-lg bg-surface-container-high text-on-surface border border-outline-variant/40 hover:border-primary-container/50 hover:text-primary-fixed font-display text-[12px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <MaterialIcon name="play_arrow" size={16} fill />
          {busy ? "Запуск..." : `Начать этап 1 · ${stageHours(template, 1)}ч`}
        </button>
      ) : state.stageReady ? (
        <button
          onClick={completeStage}
          disabled={busy}
          className="mt-1 w-full py-2.5 rounded-lg font-display text-[12px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          style={{
            background: cat.color,
            color: "#0A0A0B",
            boxShadow: `0 0 20px ${cat.color}66`,
          }}
        >
          <MaterialIcon
            name={state.currentStage >= 3 ? "emoji_events" : "check_circle"}
            size={16}
            fill
          />
          {busy
            ? "Завершение..."
            : state.currentStage >= 3
              ? `Завершить миссию · +${stagePoints(template, 3)} очк`
              : `Завершить этап ${state.currentStage} · +${stagePoints(template, state.currentStage)} очк`}
        </button>
      ) : (
        <StageTimerBanner
          template={template}
          stage={state.currentStage}
          stageStartedAt={state.stageStartedAt}
          color={cat.color}
        />
      )}
    </div>
  );
}

function StageRow({
  template,
  stage,
  state,
  color,
}: {
  template: MissionTemplate;
  stage: number;
  state: MissionState;
  color: string;
}) {
  const hours = stageHours(template, stage);
  const title = stageTitle(template, stage);
  const points = stagePoints(template, stage);

  const completed = state.completedAt !== null || stage < state.currentStage;
  const active = state.started && !state.completedAt && stage === state.currentStage;
  const locked = state.started ? stage > state.currentStage : stage > 1;

  return (
    <div
      className={cn(
        "rounded-lg p-2.5 flex items-start gap-2.5 border transition-colors",
        completed
          ? "border-transparent bg-surface-container/40"
          : active
            ? "bg-surface-container/60"
            : "border-outline-variant/20 bg-surface-container/20"
      )}
      style={active ? { borderColor: `${color}66` } : undefined}
    >
      {/* status icon */}
      <div
        className="shrink-0 w-6 h-6 rounded-full grid place-items-center mt-0.5"
        style={
          completed
            ? { background: color, color: "#0A0A0B" }
            : active
              ? { background: `${color}1a`, color, boxShadow: `0 0 10px ${color}55` }
              : { background: "rgba(255,255,255,0.04)", color: "#849495" }
        }
      >
        {completed ? (
          <MaterialIcon name="check" size={14} weight={700} />
        ) : active ? (
          <span className="font-display text-[10px] font-extrabold">{stage}</span>
        ) : (
          <MaterialIcon name="lock" size={12} />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-wider font-medium",
              completed ? "text-on-surface-variant" : active ? "text-on-surface" : "text-on-surface-variant/60"
            )}
          >
            Этап {stage} · {hours}ч
          </span>
          <span
            className="font-mono text-[10px] font-medium"
            style={{ color: completed || active ? color : "#849495" }}
          >
            +{points} очк
          </span>
        </div>
        <p
          className={cn(
            "font-mono text-[11px] leading-relaxed",
            completed ? "text-on-surface-variant line-through opacity-60" : active ? "text-on-surface" : "text-on-surface-variant/60"
          )}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

/** Shows a live 7-day countdown while the next mission is on cooldown (non-premium). */
function CooldownBanner({
  until,
  color,
}: {
  until: string;
  color: string;
}) {
  const deadline = new Date(until).getTime();
  const r = useCountdown(deadline);
  return (
    <div
      className="mt-1 w-full py-2.5 rounded-lg flex items-center justify-between px-3 border font-display text-[12px] font-bold uppercase tracking-wider"
      style={{
        background: `${color}12`,
        borderColor: `${color}40`,
        color,
      }}
    >
      <span className="flex items-center gap-2">
        <MaterialIcon name="lock_clock" size={16} fill />
        След. миссия через
      </span>
      <span className="font-mono text-[14px] tracking-wider">
        {formatRemaining(r)}
      </span>
    </div>
  );
}

/** Shows a live countdown while a stage is being performed. */
function StageTimerBanner({
  template,
  stage,
  stageStartedAt,
  color,
}: {
  template: MissionTemplate;
  stage: number;
  stageStartedAt: string | null;
  color: string;
}) {
  const hours = stageHours(template, stage);
  const deadline =
    stageStartedAt != null
      ? new Date(stageStartedAt).getTime() + hours * 3600 * 1000
      : null;
  const r = useCountdown(deadline);
  return (
    <div
      className="mt-1 w-full py-2.5 rounded-lg flex items-center justify-between px-3 border font-display text-[12px] font-bold uppercase tracking-wider"
      style={{
        background: `${color}12`,
        borderColor: `${color}40`,
        color,
      }}
    >
      <span className="flex items-center gap-2">
        <MaterialIcon name="hourglass_top" size={16} fill />
        Этап {stage} выполняется
      </span>
      <span className="font-mono text-[14px] tracking-wider">
        {formatRemaining(r)}
      </span>
    </div>
  );
}
