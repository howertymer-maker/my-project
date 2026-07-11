"use client";

import { useEffect, useState } from "react";

export type Remaining = {
  ms: number;
  ready: boolean;
  d: number;
  h: number;
  m: number;
  s: number;
};

const ZERO: Remaining = { ms: 0, ready: true, d: 0, h: 0, m: 0, s: 0 };

function compute(deadlineMs: number): Remaining {
  const ms = Math.max(0, deadlineMs - Date.now());
  const ready = ms === 0;
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { ms, ready, d, h, m, s };
}

/**
 * Live countdown to a deadline (epoch ms). Re-renders every second.
 * Returns { ready: true } once the deadline has passed.
 */
export function useCountdown(deadlineMs: number | null): Remaining {
  const initial = deadlineMs != null ? compute(deadlineMs) : ZERO;
  const [remaining, setRemaining] = useState<Remaining>(initial);

  useEffect(() => {
    if (deadlineMs == null) {
      return;
    }
    // defer the initial sync to avoid set-state-in-effect cascades
    let active = true;
    Promise.resolve().then(() => {
      if (active) setRemaining(compute(deadlineMs));
    });
    const id = setInterval(() => {
      const r = compute(deadlineMs);
      setRemaining(r);
      if (r.ready) clearInterval(id);
    }, 1000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [deadlineMs]);

  return remaining;
}

export function formatRemaining(r: Remaining): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  if (r.d > 0) return `${r.d}д ${pad(r.h)}:${pad(r.m)}:${pad(r.s)}`;
  return `${pad(r.h)}:${pad(r.m)}:${pad(r.s)}`;
}
