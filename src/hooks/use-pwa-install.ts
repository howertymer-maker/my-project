"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function captureInstallPrompt() {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent("pwa-installable"));
  });
}

if (typeof window !== "undefined") {
  captureInstallPrompt();
}

/** Returns true if the app can be installed (beforeinstallprompt fired). */
export function usePwaInstallable() {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handler = () => setInstallable(true);
    window.addEventListener("pwa-installable", handler);

    // Check if already installed (standalone mode) — defer to microtask
    if (window.matchMedia("(display-mode: standalone)").matches) {
      Promise.resolve().then(() => setInstallable(false));
      return () => window.removeEventListener("pwa-installable", handler);
    }

    // iOS doesn't support beforeinstallprompt — show manual instructions
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      Promise.resolve().then(() => setInstallable(true));
    }

    return () => window.removeEventListener("pwa-installable", handler);
  }, []);

  return installable;
}

/** Triggers the install prompt (Android/Chrome) or shows iOS instructions. */
export async function triggerInstall(): Promise<boolean> {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    // iOS: no API, show alert with instructions
    alert(
      'Чтобы установить приложение на iPhone:\n\n1. Нажмите кнопку «Поделиться» (□↑)\n2. Выберите «На экран Домой»\n3. Нажмите «Добавить»'
    );
    return false;
  }

  if (!deferredPrompt) return false;

  await deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choice.outcome === "accepted";
}
