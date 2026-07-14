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

          {/* Logout button */}
          <LogoutSection onLogout={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ====================== LOGOUT ====================== */

function LogoutSection({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const doLogout = async () => {
    setBusy(true);
    try {
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/login", redirect: true });
    } catch {
      // fallback: hard redirect
      window.location.href = "/login";
    }
  };

  if (confirming) {
    return (
      <div className="flex flex-col gap-3">
        <div className="glass-panel rounded-xl p-4 border border-error/30 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MaterialIcon name="warning" size={20} className="text-error" fill />
            <span className="font-display text-sm font-bold text-on-surface">
              Выйти из аккаунта?
            </span>
          </div>
          <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed">
            Вы будете перенаправлены на страницу входа. Ваши данные сохранятся.
          </p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setConfirming(false)}
              disabled={busy}
              className="flex-1 py-2.5 rounded-lg bg-surface-container/60 text-on-surface-variant border border-outline-variant/40 font-display text-[12px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              onClick={doLogout}
              disabled={busy}
              className="flex-1 py-2.5 rounded-lg bg-error/20 text-error border border-error/40 font-display text-[12px] font-bold uppercase tracking-wider active:scale-95 transition-transform disabled:opacity-50"
            >
              {busy ? "Выход..." : "Выйти"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="w-full py-3 rounded-xl bg-error/10 text-error border border-error/30 font-display text-[12px] font-bold uppercase tracking-wider hover:bg-error/20 active:scale-95 transition-all flex items-center justify-center gap-2"
    >
      <MaterialIcon name="logout" size={18} fill />
      Выйти из аккаунта
    </button>
  );
}

/* ====================== SETTINGS TAB ====================== */

function SettingsTab(props: {
  premium: boolean;
  loading: boolean;
  toggling: boolean;
  onTogglePremium: (v: boolean) => void;
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

      {/* Bug reports */}
      <BugReportsSection />

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
            <button
              onClick={() => window.open("/terms", "_blank")}
              className="text-on-surface-variant hover:text-primary-container transition-colors"
              aria-label="Открыть условия"
            >
              <MaterialIcon name="open_in_new" size={16} />
            </button>
          }
        />
        <Row
          icon="privacy_tip"
          label="Политика конфиденциальности"
          description="Как мы храним данные"
          control={
            <button
              onClick={() => window.open("/privacy", "_blank")}
              className="text-on-surface-variant hover:text-primary-container transition-colors"
              aria-label="Открыть политику"
            >
              <MaterialIcon name="open_in_new" size={16} />
            </button>
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

/** Avatar upload section — compresses image on client before upload. */
function AvatarSection({ onChanged }: { onChanged: () => void }) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // Compress image on client: resize to 256x256 + convert to JPEG 0.8 quality
      const compressed = await compressImage(file, 256, 0.8);

      const fd = new FormData();
      fd.append("file", compressed);
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
            PNG/JPG, авто-сжатие до 256px
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

/** Bug reports section — lets users submit and view their bug reports. */
function BugReportsSection() {
  const { toast } = useToast();
  const [reports, setReports] = useState<
    Array<{ id: string; title: string; body: string; category: string; status: string; createdAt: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);

  const fetchReports = () => {
    fetch("/api/bug-reports", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
    open: { label: "Открыт", color: "#00f2ff", bg: "rgba(0,242,255,0.12)" },
    in_progress: { label: "В работе", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
    resolved: { label: "Решён", color: "#b6f700", bg: "rgba(182,247,0,0.12)" },
    closed: { label: "Закрыт", color: "#b9cacb", bg: "rgba(185,202,203,0.12)" },
  };

  return (
    <Section title="Репорты" icon="bug_report" accent="#ff6b6b">
      <div className="p-3 flex flex-col gap-3">
        <p className="font-mono text-[10px] text-on-surface-variant leading-relaxed">
          Нашли баг или есть идея? Отправьте репорт — мы рассмотрим.
        </p>

        <button
          onClick={() => setComposing(true)}
          className="w-full py-2 rounded-lg bg-primary-container/15 text-primary-fixed border border-primary-container/40 font-display text-[11px] font-bold uppercase tracking-wider hover:bg-primary-container/25 transition-colors flex items-center justify-center gap-1.5"
        >
          <MaterialIcon name="add" size={16} fill />
          Новый репорт
        </button>

        {/* Reports list */}
        {loading ? (
          <div className="font-mono text-[10px] text-on-surface-variant text-center py-2">
            Загрузка...
          </div>
        ) : reports.length === 0 ? (
          <div className="font-mono text-[10px] text-on-surface-variant text-center py-2">
            Пока нет репортов
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto scrollbar-thin">
            {reports.map((r) => {
              const sm = statusMeta[r.status] || statusMeta.open;
              return (
                <div
                  key={r.id}
                  className="rounded-lg p-2.5 border border-outline-variant/30 bg-surface-container/40 flex flex-col gap-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-[12px] font-bold text-on-surface leading-tight">
                      {r.title}
                    </span>
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                      style={{ color: sm.color, background: sm.bg }}
                    >
                      {sm.label}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-on-surface-variant leading-relaxed line-clamp-2">
                    {r.body}
                  </p>
                  <span className="font-mono text-[8px] text-on-surface-variant/60 uppercase tracking-wider">
                    {new Date(r.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compose modal */}
      {composing && (
        <BugReportModal
          onClose={() => setComposing(false)}
          onCreated={() => {
            setComposing(false);
            fetchReports();
          }}
        />
      )}
    </Section>
  );
}

function BugReportModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("bug");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Заполните заголовок и описание", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/bug-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, category }),
      });
      if (!res.ok) throw new Error("Не удалось отправить");
      toast({ title: "Репорт отправлен!" });
      onCreated();
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const categories = [
    { key: "bug", label: "Баг", icon: "bug_report" },
    { key: "suggestion", label: "Идея", icon: "lightbulb" },
    { key: "question", label: "Вопрос", icon: "help" },
    { key: "other", label: "Другое", icon: "more_horiz" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-[560px] glass-panel rounded-xl p-5 flex flex-col gap-3 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-on-surface flex items-center gap-2">
            <MaterialIcon name="bug_report" size={20} className="text-error" fill />
            Новый репорт
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Закрыть"
          >
            <MaterialIcon name="close" size={20} />
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            Тип
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => {
              const active = category === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md border font-mono text-[10px] uppercase tracking-wider transition-all"
                  style={{
                    color: active ? "#ff6b6b" : "#b9cacb",
                    borderColor: active ? "rgba(255,107,107,0.5)" : "rgba(255,255,255,0.08)",
                    background: active ? "rgba(255,107,107,0.1)" : "transparent",
                  }}
                >
                  <MaterialIcon name={c.icon} size={12} fill={active} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            Заголовок
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Кратко опишите проблему"
            className="bg-surface-container/60 border border-outline-variant/40 rounded-lg px-3 py-2.5 font-mono text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container/60 transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
            Описание
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Подробно опишите что произошло, на каком экране, какие действия привели к проблеме..."
            rows={5}
            className="bg-surface-container/60 border border-outline-variant/40 rounded-lg px-3 py-2.5 font-mono text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container/60 transition-colors resize-none"
          />
        </label>

        <div className="flex gap-2 mt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-surface-container/60 text-on-surface-variant border border-outline-variant/40 font-display text-[12px] font-bold uppercase tracking-wider transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary font-display text-[12px] font-bold uppercase tracking-wider neon-glow-primary active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {busy ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Compresses an image file on the client using Canvas API.
 * - Resizes to maxSize×maxSize (square crop, center)
 * - Converts to JPEG with given quality (0-1)
 * - Returns a File object (much smaller than the original)
 *
 * Example: 4 MB PNG → ~30 KB JPEG
 */
async function compressImage(
  file: File,
  maxSize: number = 256,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas не поддерживается"));
          return;
        }

        // Square crop: take the center of the image
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxSize, maxSize);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Не удалось сжать"));
              return;
            }
            resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Не удалось загрузить изображение"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}
