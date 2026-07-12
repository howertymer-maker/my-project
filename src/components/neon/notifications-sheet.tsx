"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { MaterialIcon } from "@/components/material-icon";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  icon: string;
  color: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  type: "reward" | "streak" | "social" | "mission" | "challenge" | "system";
};

type NotifsResponse = {
  notifications: Notif[];
  unreadCount: number;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч назад`;
  const days = Math.floor(hrs / 24);
  return `${days} д назад`;
}

const FILTERS = [
  { key: "all", label: "Все" },
  { key: "reward", label: "Награды" },
  { key: "mission", label: "Миссии" },
  { key: "social", label: "Соц." },
  { key: "streak", label: "Серии" },
];

export function NotificationsSheet({ open, onOpenChange }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [data, setData] = useState<NotifsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = (f: string) => {
    setLoading(true);
    const url = f === "all" ? "/api/notifications" : `/api/notifications?filter=${f}`;
    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) {
      Promise.resolve().then(() => fetchNotifs(filter));
    }
  }, [open, filter]);

  const onFilterChange = (f: string) => {
    setFilter(f);
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "all" }),
    });
    fetchNotifs(filter);
  };

  const notifs = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[92vw] max-w-[420px] bg-[#0e0e0f] border-l border-primary-container/20 p-0 flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-outline-variant/30">
          <SheetTitle className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
            <MaterialIcon name="notifications" size={22} className="text-primary-container" fill />
            Уведомления
          </SheetTitle>
          <SheetDescription className="font-mono text-[11px] text-on-surface-variant">
            {unreadCount > 0 ? `${unreadCount} непрочитанных` : "Все прочитаны"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-3 flex flex-col gap-4">
          {/* Header: unread count + mark all read */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
              {unreadCount} непрочитано
            </span>
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="font-mono text-[10px] text-primary-fixed hover:text-primary-container uppercase tracking-widest transition-colors disabled:opacity-40"
            >
              Прочитать все
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => onFilterChange(f.key)}
                className={cn(
                  "px-2.5 py-1 rounded-md border font-mono text-[10px] uppercase tracking-wider transition-all",
                  filter === f.key
                    ? "bg-primary-container/15 text-primary-fixed border-primary-container/50"
                    : "bg-surface-container/40 text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Notifications list */}
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="glass-panel rounded-xl p-8 text-center text-on-surface-variant font-mono text-sm">
                Загрузка...
              </div>
            ) : notifs.length === 0 ? (
              <div className="glass-panel rounded-xl p-8 text-center text-on-surface-variant font-mono text-sm">
                Нет уведомлений
              </div>
            ) : (
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "rounded-xl p-3 flex items-start gap-2.5 border transition-colors",
                    !n.read
                      ? "bg-surface-container/70 border-outline-variant/40"
                      : "bg-surface-container/30 border-outline-variant/20 opacity-70"
                  )}
                >
                  <div
                    className="shrink-0 w-9 h-9 rounded-lg grid place-items-center border"
                    style={{
                      background: `${n.color}1a`,
                      borderColor: `${n.color}55`,
                      color: n.color,
                    }}
                  >
                    <MaterialIcon name={n.icon} size={18} fill />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-display text-[13px] font-bold text-on-surface leading-tight">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-secondary-fixed shadow-[0_0_6px_#b6f700] mt-1.5" />
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-on-surface-variant leading-relaxed mt-1">
                      {n.body}
                    </p>
                    <span className="font-mono text-[9px] text-on-surface-variant/70 uppercase tracking-wider mt-1.5 block">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
