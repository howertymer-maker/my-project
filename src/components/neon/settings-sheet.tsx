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
          {/* Avatar upload */}
          <AvatarSection onChanged={onChanged} />
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
        <PushRow />
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

/** Avatar upload section — lets the user upload a profile picture. */
function AvatarSection({ onChanged }: { onChanged: () => void }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/avatar", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Ошибка загрузки");
      }
      toast({ title: "Аватар обновлён" });
      onChanged();
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Section title="Аватар" icon="account_circle" accent="#00f2ff">
      <div className="p-3 flex items-center gap-3">
        <MaterialIcon name="person" size={18} className="text-on-surface-variant shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-display text-[13px] font-bold text-on-surface">
            Загрузить фото профиля
          </div>
          <div className="font-mono text-[10px] text-on-surface-variant mt-0.5">
            PNG/JPG, максимум 2 МБ
          </div>
        </div>
        <label className="shrink-0 cursor-pointer font-display text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-primary-container text-on-primary neon-glow-primary active:scale-95 transition-transform">
          {uploading ? "..." : "Загрузить"}
          <input type="file" accept="image/*" onChange={onFile} className="hidden" disabled={uploading} />
        </label>
      </div>
    </Section>
  );
}

/** Real push notification subscription — requests permission + registers push. */
function PushRow() {
  const { toast } = useToast();
  const [status, setStatus] = useState<"unsupported" | "default" | "granted" | "denied" | "subscribed">("default");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission === "granted" ? "granted" : "default");
    // check if already subscribed
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      if (sub) setStatus("subscribed");
    }).catch(() => {});
  }, []);

  const subscribe = async () => {
    setBusy(true);
    try {
      // 1. Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        toast({ title: "Уведомления заблокированы", variant: "destructive" });
        return;
      }

      // 2. Get VAPID public key from server
      const vapidRes = await fetch("/api/push/vapid-public");
      if (!vapidRes.ok) throw new Error("Push не настроен");
      const { publicKey } = await vapidRes.json();

      // 3. Subscribe via service worker
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // 4. Send subscription to server
      const subJson = sub.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      setStatus("subscribed");
      toast({ title: "Push-уведомления включены!" });
    } catch (e) {
      toast({
        title: "Ошибка",
        description: e instanceof Error ? e.message : "Не удалось",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        const subJson = sub.toJSON();
        await sub.unsubscribe();
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subJson.endpoint }),
        });
      }
      setStatus("granted");
      toast({ title: "Push-уведомления отключены" });
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  if (status === "unsupported") {
    return (
      <Row
        icon="notifications_off"
        label="Push-уведомления"
        description="Не поддерживается в этом браузере"
        control={<span className="font-mono text-[9px] text-on-surface-variant uppercase">N/A</span>}
      />
    );
  }

  return (
    <Row
      icon="notifications_active"
      label="Push-уведомления"
      description={
        status === "subscribed"
          ? "Включены — приходят в браузер"
          : status === "denied"
            ? "Заблокированы настройками браузера"
            : "Напоминания в браузере"
      }
      control={
        status === "subscribed" ? (
          <button
            onClick={unsubscribe}
            disabled={busy}
            className="font-display text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border border-error/40 text-error bg-error/10 active:scale-95 transition-transform disabled:opacity-50"
          >
            {busy ? "..." : "Откл"}
          </button>
        ) : (
          <button
            onClick={subscribe}
            disabled={busy || status === "denied"}
            className="font-display text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md bg-primary-container text-on-primary neon-glow-primary active:scale-95 transition-transform disabled:opacity-50"
          >
            {busy ? "..." : "Включить"}
          </button>
        )
      }
    />
  );
}

// Convert base64 VAPID key to Uint8Array for PushManager.subscribe
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}
