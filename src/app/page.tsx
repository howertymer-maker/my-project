"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TopBar } from "@/components/neon/top-bar";
import { BottomNav, type TabKey } from "@/components/neon/bottom-nav";
import { ProfileScreen } from "@/components/neon/screens/profile-screen";
import { HabitsScreen } from "@/components/neon/screens/habits-screen";
import { MissionsScreen } from "@/components/neon/screens/missions-screen";
import { CommunityScreen } from "@/components/neon/screens/community-screen";
import { MaterialIcon } from "@/components/material-icon";
import { IntroVideo, shouldShowIntro } from "@/components/neon/intro-video";

/** Broadcast a refresh request to all data-driven screens (after skip-12h / premium toggle). */
export function refreshAll() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("neon-refresh"));
  }
}

// Bypass auth only when explicitly enabled (dev/preview). On Vercel, leave
// NEXT_PUBLIC_AUTH_BYPASS unset or set to "false" to require login.
const AUTH_BYPASS = process.env.NEXT_PUBLIC_AUTH_BYPASS === "true";

export default function Home() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<TabKey>("profile");
  const [showIntro, setShowIntro] = useState(false);

  const authenticated = AUTH_BYPASS || (status === "authenticated" && !!session);

  // Show intro video once the user is authenticated, on first entry this browser session
  useEffect(() => {
    if (authenticated) {
      // defer to microtask to avoid set-state-in-effect cascading render
      Promise.resolve().then(() => {
        if (shouldShowIntro()) setShowIntro(true);
      });
    }
  }, [authenticated]);

  // Loading state while session is being checked (only when auth is required)
  if (!AUTH_BYPASS && status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0B] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary-container/30 border-t-primary-container animate-spin-med" />
        <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest">
          Загрузка системы...
        </span>
      </div>
    );
  }

  // Not authenticated → show login prompt (only when auth is required)
  if (!authenticated) {
    return <LoginPrompt />;
  }

  return (
    <>
      {showIntro && <IntroVideo onDone={() => setShowIntro(false)} />}

      <div className="relative min-h-screen flex flex-col bg-[#0A0A0B] text-on-surface overflow-x-hidden">
        {/* Ambient background glows */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(900px 500px at 15% -5%, rgba(0,242,255,0.10), transparent 60%), radial-gradient(700px 500px at 100% 10%, rgba(182,247,0,0.06), transparent 55%), radial-gradient(800px 600px at 50% 110%, rgba(233,179,255,0.08), transparent 60%)",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <TopBar onMissionsChanged={refreshAll} />

        <main className="relative z-10 flex-1 pt-[76px] pb-[110px] w-full max-w-[640px] mx-auto px-5">
          {tab === "profile" && <ProfileScreen />}
          {tab === "habits" && <HabitsScreen />}
          {tab === "missions" && <MissionsScreen />}
          {tab === "community" && <CommunityScreen />}
        </main>

        <BottomNav tab={tab} onChange={setTab} />
      </div>
    </>
  );
}

function LoginPrompt() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0A0A0B] px-5 overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(900px 500px at 50% -5%, rgba(0,242,255,0.14), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-sm">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container/50 neon-glow-primary grid place-items-center bg-gradient-to-br from-[#0e3a3d] via-[#0A0A0B] to-[#1a0a2e]">
          <span className="font-display text-3xl font-extrabold text-primary-fixed text-glow-primary">
            N
          </span>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-on-surface">
          Nevergiveup
        </h1>
        <p className="font-mono text-[12px] text-on-surface-variant leading-relaxed">
          Геймифицированная система саморазвития. Войди в аккаунт или создай новый,
          чтобы начать прокачку навыков.
        </p>
        <div className="flex flex-col gap-2.5 w-full mt-2">
          <a
            href="/login"
            className="w-full py-3 rounded-lg bg-primary-container text-on-primary font-display text-[13px] font-bold uppercase tracking-wider neon-glow-primary active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <MaterialIcon name="login" size={18} fill />
            Войти
          </a>
          <a
            href="/register"
            className="w-full py-3 rounded-lg bg-surface-container/60 text-on-surface border border-outline-variant/40 hover:border-primary-container/50 font-display text-[13px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <MaterialIcon name="person_add" size={18} fill />
            Регистрация
          </a>
        </div>
      </div>
    </div>
  );
}
