"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent("pwa-installable"));
  });
}

/** Returns true if the app can be installed via native prompt. */
export function usePwaInstallable() {
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    const handler = () => Promise.resolve().then(() => setInstallable(true));
    window.addEventListener("pwa-installable", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      return () => window.removeEventListener("pwa-installable", handler);
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      Promise.resolve().then(() => setInstallable(true));
    }

    return () => window.removeEventListener("pwa-installable", handler);
  }, []);

  return installable;
}

/**
 * Triggers the install prompt. If native prompt is not available,
 * shows a modal with manual instructions for the user's platform.
 */
export async function triggerInstall(): Promise<boolean> {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

  // Already installed
  if (isStandalone) {
    showInstallModal("Приложение уже установлено!", "Вы уже используете установленную версию Nevergiveup.");
    return false;
  }

  // Native prompt available (Chrome/Edge/Android)
  if (deferredPrompt) {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return choice.outcome === "accepted";
  }

  // No native prompt — show manual instructions
  if (isIOS) {
    showInstallModal(
      "Установка на iPhone/iPad",
      `1. Нажмите кнопку «Поделиться» (квадрат со стрелкой вверх ⬆️) в нижней панели Safari\n\n2. Прокрутите вниз и выберите «На экран „Домой"»\n\n3. Нажмите «Добавить»\n\nПриложение появится на главном экране с иконкой.`
    );
  } else if (isAndroid) {
    showInstallModal(
      "Установка на Android",
      `1. Откройте меню браузера (три точки ⋮ в правом верхнем углу)\n\n2. Выберите «Установить приложение» или «Добавить на главный экран»\n\n3. Подтвердите установку\n\nПриложение появится на главном экране с иконкой.`
    );
  } else {
    showInstallModal(
      "Установка на компьютер",
      `1. В адресной строке браузера (справа) найдите иконку установки ➕\n\n2. Нажмите на неё и подтвердите установку\n\n3. Или откройте меню браузера → «Установить Nevergiveup»\n\nПриложение откроется в отдельном окне без адресной строки.`
    );
  }

  return false;
}

/** Shows a modal dialog with install instructions. */
function showInstallModal(title: string, body: string) {
  // Remove any existing modal
  const existing = document.getElementById("pwa-install-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "pwa-install-modal";
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    font-family: 'JetBrains Mono', monospace;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: #1c1b1c; border: 1px solid rgba(0,242,255,0.3);
    border-radius: 16px; padding: 24px; max-width: 380px; width: 100%;
    box-shadow: 0 0 30px rgba(0,242,255,0.15);
  `;

  modal.innerHTML = `
    <h2 style="font-family: 'Sora', sans-serif; font-size: 18px; font-weight: 700; color: #e5e2e3; margin: 0 0 16px 0;">
      ${title}
    </h2>
    <p style="font-size: 13px; color: #b9cacb; line-height: 1.6; margin: 0 0 20px 0; white-space: pre-line;">
      ${body}
    </p>
    <button id="pwa-install-close" style="
      width: 100%; padding: 12px; border: none; border-radius: 8px;
      background: #00f2ff; color: #00363a;
      font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em; cursor: pointer;
      box-shadow: 0 0 15px rgba(0,242,255,0.3);
    ">
      Понятно
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on button click
  const closeBtn = document.getElementById("pwa-install-close");
  closeBtn?.addEventListener("click", () => overlay.remove());

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
