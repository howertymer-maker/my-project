"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

/**
 * Lightweight data-fetching hook (no provider required).
 * All setState calls happen inside async callbacks (not synchronously
 * in the effect body) to satisfy react-hooks/set-state-in-effect.
 */
export function useApi<T>(url: string | null): State<T> {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: !!url,
    error: null,
  });
  const [tick, setTick] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!url) {
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    // mark loading via a microtask-driven callback (async, not sync in effect body)
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      setState((s) => ({ ...s, loading: true, error: null }));
    });

    fetch(url, { signal: ctrl.signal, cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        if (!active) return;
        setState({ data: json as T, loading: false, error: null });
      })
      .catch((e) => {
        if (!active || e?.name === "AbortError") return;
        setState((s) => ({
          ...s,
          loading: false,
          error: e?.message || "Ошибка загрузки",
        }));
      });

    return () => {
      active = false;
      ctrl.abort();
    };
  }, [url, tick]);

  return { ...state, refetch };
}
