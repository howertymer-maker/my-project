"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/material-icon";

const STORAGE_KEY = "ngu-intro-watched";

/**
 * Cinematic intro video overlay shown once per browser session on first entry
 * to the authenticated app. Dismissed via the "Начать развитие" button.
 */
export function IntroVideo({ onDone }: { onDone: () => void }) {
  const [videoError, setVideoError] = useState(false);
  const [fadeout, setFadeout] = useState(false);

  const dismiss = () => {
    setFadeout(true);
    // mark as watched so it doesn't replay this browser session
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setTimeout(onDone, 450);
  };

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-opacity duration-450 ${
        fadeout ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Video background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {!videoError ? (
          <video
            autoPlay
            muted
            playsInline
            onError={() => setVideoError(true)}
            onEnded={dismiss}
            className="w-full h-full object-cover"
          >
            <source src="/intro.mp4" type="video/mp4" />
          </video>
        ) : (
          // Fallback animated gradient if video is missing
          <div
            className="w-full h-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(0,242,255,0.15), transparent 60%), linear-gradient(135deg, #0e3a3d, #0A0A0B 60%, #1a0a2e)",
              animation: "neon-breath 3s ease-in-out infinite",
            }}
          />
        )}
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
      </div>

      {/* Brand + CTA */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-container/50 neon-glow-primary grid place-items-center bg-gradient-to-br from-[#0e3a3d] via-[#0A0A0B] to-[#1a0a2e]">
          <span className="font-display text-4xl font-extrabold text-primary-fixed text-glow-primary">
            N
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface text-glow-primary">
            Nevergiveup
          </h1>
          <p className="font-mono text-[12px] text-primary-fixed-dim uppercase tracking-[0.3em]">
            Система развития
          </p>
        </div>

        <p className="font-mono text-[13px] text-on-surface-variant leading-relaxed max-w-md">
          Твой путь начинается здесь. Прокачивай навыки, выполняй миссии,
          удерживай привычки — стань лучшей версией себя.
        </p>

        <button
          onClick={dismiss}
          className="mt-2 group flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-container text-on-primary font-display text-sm font-bold uppercase tracking-wider neon-glow-primary active:scale-95 transition-transform hover:scale-105"
        >
          <MaterialIcon name="rocket_launch" size={20} fill />
          Начать развитие
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: 18 }}>
            arrow_forward
          </span>
        </button>

        <button
          onClick={dismiss}
          className="font-mono text-[11px] text-on-surface-variant/70 hover:text-on-surface-variant uppercase tracking-widest transition-colors"
        >
          Пропустить
        </button>
      </div>
    </div>
  );
}

/** Returns true if the intro should be shown this browser session. */
export function shouldShowIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}
