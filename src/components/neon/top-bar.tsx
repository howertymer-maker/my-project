"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { SettingsSheet } from "@/components/neon/settings-sheet";

export function TopBar({ onMissionsChanged }: { onMissionsChanged?: () => void }) {
  const [level, setLevel] = useState<number>(42);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/profile", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (active && typeof d?.user?.level === "number") setLevel(d.user.level);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Allow other components (e.g. premium-lock banner) to open the settings sheet
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
              <AvatarMark />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-[13px] font-extrabold tracking-[0.12em] text-on-surface">
                NEON PROTOCOL
              </span>
              <span className="font-mono text-[10px] text-primary-fixed-dim tracking-widest mt-0.5">
                {"LVL "}{level}{" // ENDEAVORER"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative w-9 h-9 grid place-items-center rounded-md text-primary-container hover:text-secondary-fixed-dim hover:bg-surface-container/60 transition-colors"
              aria-label="Уведомления"
            >
              <MaterialIcon name="notifications" size={20} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-secondary-fixed shadow-[0_0_6px_#b6f700]" />
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
          // refresh level after potential point changes
          fetch("/api/profile", { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => {
              if (typeof d?.user?.level === "number") setLevel(d.user.level);
            })
            .catch(() => {});
        }}
      />
    </>
  );
}

/** A stylised avatar mark using initials + neon ring (no external image dependency). */
function AvatarMark() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0e3a3d] via-[#0A0A0B] to-[#1a0a2e] grid place-items-center">
      <span className="font-display text-[15px] font-extrabold text-primary-fixed text-glow-primary">
        EE
      </span>
    </div>
  );
}
