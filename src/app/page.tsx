"use client";

import { useState } from "react";
import { TopBar } from "@/components/neon/top-bar";
import { BottomNav, type TabKey } from "@/components/neon/bottom-nav";
import { ProfileScreen } from "@/components/neon/screens/profile-screen";
import { HabitsScreen } from "@/components/neon/screens/habits-screen";
import { MissionsScreen } from "@/components/neon/screens/missions-screen";
import { CommunityScreen } from "@/components/neon/screens/community-screen";

/** Broadcast a refresh request to all data-driven screens (after skip-12h / premium toggle). */
export function refreshAll() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("neon-refresh"));
  }
}

export default function Home() {
  const [tab, setTab] = useState<TabKey>("profile");

  return (
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
  );
}
