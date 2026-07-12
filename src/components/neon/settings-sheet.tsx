"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { MaterialIcon } from "@/components/material-icon";
import { useToast } from "@/hooks/use-toast";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChanged: () => void; // refetch missions after skip-12h / premium toggle
};

export function SettingsSheet({ open, onOpenChange, onChanged }: Props) {
  const { toast } = useToast();
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [skipping, setSkipping] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch("/api/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active && typeof d.premium === "boolean") setPremium(d.premium);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open]);

  const togglePremium = async (next: boolean) => {
    setToggling(true);
    setPremium(next); // optimistic
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premium: next }),
      });
      if (!res.ok) throw new Error("Ошибка");
      onChanged();
      toast({
        title: next ? "Премиум активирован" : "Премиум отключён",
        description: next
          ? "Новые миссии появляются мгновенно после завершения."
          : "Новые миссии появляются через 7 дней после завершения.",
      });
    } catch {
      setPremium(!next);
      toast({ title: "Ошибка", description: "Не удалось изменить подписку" });
    } finally {
      setToggling(false);
    }
  };

  const skip12h = async () => {
    setSkipping(true);
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "skip-12h" }),
      });
      if (!res.ok) throw new Error("Ошибка");
      const data = await res.json();
      onChanged();
      toast({
        title: "−12 часов",
        description: `Таймеры ускорены на 12ч. Затронуто миссий: ${data.affected}.`,
      });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось пропустить время" });
    } finally {
      setSkipping(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[90vw] max-w-[400px] bg-[#0e0e0f] border-l border-primary-container/20 p-0 flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-outline-variant/30">
          <SheetTitle className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
            <MaterialIcon name="settings" size={22} className="text-primary-container" fill />
            Настройки
          </SheetTitle>
          <SheetDescription className="font-mono text-[11px] text-on-surface-variant">
            Управление подпиской и таймерами миссий
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 flex flex-col gap-4">
          {/* Premium subscription */}
          <section
            className="rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
            style={{
              background: premium
                ? "linear-gradient(135deg, rgba(251,191,36,0.14), rgba(22,22,24,0.7))"
                : "rgba(22,22,24,0.6)",
              border: premium
                ? "1px solid rgba(251,191,36,0.40)"
                : "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {premium && (
              <div
                aria-hidden
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30 blur-3xl"
                style={{ background: "#fbbf24" }}
              />
            )}
            <div className="flex items-start justify-between gap-3 relative">
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className="shrink-0 w-10 h-10 rounded-lg grid place-items-center border"
                  style={{
                    background: "rgba(251,191,36,0.12)",
                    borderColor: "rgba(251,191,36,0.45)",
                    color: "#fbbf24",
                  }}
                >
                  <MaterialIcon name="diamond" size={22} fill />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display text-base font-bold text-on-surface leading-none">
                    Премиум-подписка
                  </span>
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1.5">
                    {premium ? "Активна" : "Не активна"}
                  </span>
                </div>
              </div>
              <Switch
                checked={premium}
                onCheckedChange={togglePremium}
                disabled={loading || toggling}
                aria-label="Премиум-подписка"
              />
            </div>
            <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed relative">
              {premium
                ? "Новые миссии в категории появляются мгновенно после завершения предыдущей."
                : "Без подписки следующая миссия появляется через 7 дней после завершения."}
            </p>
          </section>

          {/* Skip 12h */}
          <section className="glass-panel rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-lg grid place-items-center border border-primary-container/40 bg-primary-container/10 text-primary-container">
                <MaterialIcon name="fast_forward" size={22} fill />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display text-base font-bold text-on-surface leading-none">
                  Пропустить 12 часов
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest mt-1.5">
                  ускорить все таймеры
                </span>
              </div>
            </div>
            <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed">
              Сдвигает время выполнения всех активных этапов на 12 часов вперёд.
              Таймеры станут ближе к завершению.
            </p>
            <button
              onClick={skip12h}
              disabled={skipping}
              className="mt-1 w-full py-2.5 rounded-lg bg-primary-container text-on-primary font-display text-[12px] font-bold uppercase tracking-wider neon-glow-primary active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <MaterialIcon name="fast_forward" size={16} fill />
              {skipping ? "Выполняется..." : "Пропустить 12ч"}
            </button>
          </section>

          {/* Info */}
          <section className="glass-panel rounded-xl p-4 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <MaterialIcon name="info" size={16} className="text-primary-fixed-dim" fill />
              <span className="font-display text-sm font-bold text-on-surface">
                Как работают миссии
              </span>
            </div>
            <ul className="font-mono text-[11px] text-on-surface-variant leading-relaxed flex flex-col gap-1 list-none">
              <li>· 6 активных миссий — по одной на навык</li>
              <li>· Каждый этап имеет таймер (24ч / 48ч / 96ч)</li>
              <li>· Очки начисляются навыку категории</li>
              <li>· После завершения: премиум — мгновенно, без — 7 дней</li>
            </ul>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
