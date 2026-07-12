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
import { cn } from "@/lib/utils";

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

  // local-only toggles (no backend yet)
  const [sound, setSound] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);

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
    setPremium(next);
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
        className="w-[92vw] max-w-[420px] bg-[#0e0e0f] border-l border-primary-container/20 p-0 flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-outline-variant/30">
          <SheetTitle className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
            <MaterialIcon name="settings" size={22} className="text-primary-container" fill />
            Настройки
          </SheetTitle>
          <SheetDescription className="font-mono text-[11px] text-on-surface-variant">
            Подписка, функции и приватность
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-3 flex flex-col gap-4">
          <SettingsTab
            premium={premium}
            loading={loading}
            toggling={toggling}
            onTogglePremium={togglePremium}
            skipping={skipping}
            onSkip12h={skip12h}
            sound={sound}
            setSound={setSound}
            pushNotify={pushNotify}
            setPushNotify={setPushNotify}
            emailNotify={emailNotify}
            setEmailNotify={setEmailNotify}
            publicProfile={publicProfile}
            setPublicProfile={setPublicProfile}
            streakAlerts={streakAlerts}
            setStreakAlerts={setStreakAlerts}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ====================== SETTINGS TAB ====================== */

function SettingsTab(props: {
  premium: boolean;
  loading: boolean;
  toggling: boolean;
  onTogglePremium: (v: boolean) => void;
  skipping: boolean;
  onSkip12h: () => void;
  sound: boolean;
  setSound: (v: boolean) => void;
  pushNotify: boolean;
  setPushNotify: (v: boolean) => void;
  emailNotify: boolean;
  setEmailNotify: (v: boolean) => void;
  publicProfile: boolean;
  setPublicProfile: (v: boolean) => void;
  streakAlerts: boolean;
  setStreakAlerts: (v: boolean) => void;
}) {
  return (
    <>
      {/* Premium subscription */}
      <Section
        title="Подписка"
        icon="diamond"
        accent="#fbbf24"
      >
        <Row
          icon="diamond"
          label="Премиум-подписка"
          description={props.premium ? "Активна — миссии мгновенно" : "Не активна — миссии через 7 дней"}
          control={
            <Switch
              checked={props.premium}
              onCheckedChange={props.onTogglePremium}
              disabled={props.loading || props.toggling}
            />
          }
        />
      </Section>

      {/* Game controls */}
      <Section title="Игровые функции" icon="sports_esports" accent="#00f2ff">
        <Row
          icon="fast_forward"
          label="Пропустить 12 часов"
          description="Ускорить все таймеры этапов на 12ч"
          control={
            <button
              onClick={props.onSkip12h}
              disabled={props.skipping}
              className="font-display text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-primary-container text-on-primary neon-glow-primary active:scale-95 transition-transform disabled:opacity-50"
            >
              {props.skipping ? "..." : "Пропустить"}
            </button>
          }
        />
        <Row
          icon="volume_up"
          label="Звуковые эффекты"
          description="Звуки завершения и наград"
          control={
            <Switch checked={props.sound} onCheckedChange={props.setSound} />
          }
        />
      </Section>

      {/* Notifications */}
      <Section title="Уведомления" icon="notifications" accent="#e9b3ff">
        <Row
          icon="notifications_active"
          label="Push-уведомления"
          description="Напоминания в браузере"
          control={
            <Switch checked={props.pushNotify} onCheckedChange={props.setPushNotify} />
          }
        />
        <Row
          icon="mail"
          label="Email-уведомления"
          description="Сводка на почту"
          control={
            <Switch checked={props.emailNotify} onCheckedChange={props.setEmailNotify} />
          }
        />
        <Row
          icon="local_fire_department"
          label="Алёрты серии"
          description="Предупреждать о риске прервать серию"
          control={
            <Switch checked={props.streakAlerts} onCheckedChange={props.setStreakAlerts} />
          }
        />
      </Section>

      {/* Privacy */}
      <Section title="Конфиденциальность" icon="shield" accent="#22c55e">
        <Row
          icon="public"
          label="Публичный профиль"
          description="Виден в сообществе и рейтинге"
          control={
            <Switch checked={props.publicProfile} onCheckedChange={props.setPublicProfile} />
          }
        />
        <Row
          icon="download"
          label="Экспорт данных"
          description="Скачать все свои данные"
          control={
            <button className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-md border border-outline-variant/40 text-on-surface-variant hover:text-on-surface transition-colors">
              Экспорт
            </button>
          }
        />
      </Section>

      {/* About */}
      <Section title="О приложении" icon="info" accent="#b9cacb">
        <Row
          icon="tag"
          label="Версия"
          description="Nevergiveup 1.0.0"
          control={<span className="font-mono text-[10px] text-on-surface-variant">1.0.0</span>}
        />
        <Row
          icon="description"
          label="Условия использования"
          description="Политика и правила"
          control={
            <MaterialIcon name="chevron_right" size={18} className="text-on-surface-variant" />
          }
        />
        <Row
          icon="privacy_tip"
          label="Политика конфиденциальности"
          description="Как мы храним данные"
          control={
            <MaterialIcon name="chevron_right" size={18} className="text-on-surface-variant" />
          }
        />
      </Section>
    </>
  );
}

/* ====================== Shared bits ====================== */

function Section({
  title,
  icon,
  accent,
  children,
}: {
  title: string;
  icon: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 px-1 mb-0.5">
        <MaterialIcon name={icon} size={14} fill />
        <span
          className="font-display text-[11px] font-bold uppercase tracking-widest"
          style={{ color: accent }}
        >
          {title}
        </span>
      </div>
      <div className="glass-panel rounded-xl overflow-hidden">{children}</div>
    </section>
  );
}

function Row({
  icon,
  label,
  description,
  control,
}: {
  icon: string;
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-outline-variant/20 last:border-b-0">
      <span className="shrink-0 text-on-surface-variant">
        <MaterialIcon name={icon} size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-display text-[13px] font-bold text-on-surface leading-tight">
          {label}
        </div>
        {description && (
          <div className="font-mono text-[10px] text-on-surface-variant leading-snug mt-0.5">
            {description}
          </div>
        )}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  );
}
