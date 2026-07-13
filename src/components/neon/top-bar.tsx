"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { SettingsSheet } from "@/components/neon/settings-sheet";
import { NotificationsSheet } from "@/components/neon/notifications-sheet";

export function TopBar({ onMissionsChanged }: { onMissionsChanged?: () => void }) {
  const [level, setLevel] = useState<number>(42);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // fetch level + avatar + unread notifications count
  const refreshBadge = () => {
    fetch("/api/notifications?unread=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.unreadCount === "number") setUnreadCount(d.unreadCount);
      })
      .catch(() => {});
  };

  useEffect(() => {
    let active = true;
    fetch("/api/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (typeof d?.user?.level === "number") setLevel(d.user.level);
        if (d?.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl);
        if (d?.user?.displayName) setDisplayName(d.user.displayName);
      })
      .catch(() => {});
    refreshBadge();
    return () => {
      active = false;
    };
  }, []);

  // refresh badge when notifications sheet closes (user may have read them)
  useEffect(() => {
    if (!notifOpen) refreshBadge();
  }, [notifOpen]);

  // refresh badge on global refresh events
  useEffect(() => {
    const handler = () => refreshBadge();
    window.addEventListener("neon-refresh", handler);
    return () => window.removeEventListener("neon-refresh", handler);
  }, []);

  // Allow other components to open the settings sheet
  useEffect(() => {
    const handler = () => setSettingsOpen(true);
    window.addEventListener("neon-open-settings", handler);
    return () => window.removeEventListener("neon-open-settings", handler);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0A0B]/80 border-b border-primary-container/20 shadow-[0_0_15px_rgba(0,242,255,0.08)]">
        <div className="max-w-[640px] mx-auto flex justify-between items-center px-5 py-3">
          {/* Avatar / brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/40 neon-glow-primary">
              <AvatarMark avatarUrl={avatarUrl} displayName={displayName} />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-[13px] font-extrabold tracking-[0.12em] text-on-surface">
                Nevergiveup
              </span>
              <span className="font-mono text-[10px] text-primary-fixed-dim tracking-widest mt-0.5">
                {"LVL "}{level}{" // ENDEAVORER"}
              </span>
            </div>
          </div>

          {/* Actions — notifications (bell) + settings (gear) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNotifOpen(true)}
              className="relative w-9 h-9 grid place-items-center rounded-md text-primary-container hover:text-secondary-fixed-dim hover:bg-surface-container/60 transition-colors"
              aria-label="Уведомления"
            >
              <MaterialIcon name="notifications" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary-fixed text-on-secondary font-display text-[9px] font-extrabold grid place-items-center shadow-[0_0_8px_#b6f700]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="w-9 h-9 grid place-items-center rounded-md text-primary-container hover:text-secondary-fixed-dim hover:bg-surface-container/60 transition-colors"
              aria-label="Настройки"
            >
              <MaterialIcon name="settings" size={20} />
            </button>
          </div>
        </div>
      </header>

      <SettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onChanged={() => {
          onMissionsChanged?.();
          fetch("/api/profile", { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => {
              if (typeof d?.user?.level === "number") setLevel(d.user.level);
              if (d?.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl);
              if (d?.user?.displayName) setDisplayName(d.user.displayName);
            })
            .catch(() => {});
        }}
      />

      <NotificationsSheet open={notifOpen} onOpenChange={setNotifOpen} />
    </>
  );
}

/** A stylised avatar mark — shows uploaded avatar or fallback initial. */
function AvatarMark({ avatarUrl, displayName }: { avatarUrl: string | null; displayName: string }) {
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt="Аватар" className="w-full h-full object-cover" />
    );
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0e3a3d] via-[#0A0A0B] to-[#1a0a2e] grid place-items-center">
      <span className="font-display text-base font-extrabold text-primary-fixed text-glow-primary">
        {displayName ? displayName.charAt(0).toUpperCase() : "N"}
      </span>
    </div>
  );
}
