"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { MaterialIcon } from "@/components/material-icon";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "register";

export function AuthScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, displayName: name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
      }

      // Sign in with redirect:false so we can show a toast and verify the session
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result || result.error || !result.ok) {
        throw new Error("Неверный email или пароль");
      }

      toast({ title: mode === "register" ? "Аккаунт создан" : "Вход выполнен" });

      // Wait for the session cookie to be fully established before navigating.
      // Polling getSession() guarantees the cookie is readable by the browser,
      // otherwise the homepage may briefly render the unauthenticated state.
      let sessionOk = false;
      for (let i = 0; i < 20; i++) {
        const session = await getSession();
        if (session) {
          sessionOk = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 150));
      }

      if (!sessionOk) {
        // fallback: still navigate, the homepage will re-check
        window.location.href = "/";
        return;
      }

      // Session confirmed — navigate to the app.
      window.location.href = "/";
    } catch (err) {
      toast({
        title: "Ошибка",
        description: err instanceof Error ? err.message : "Не удалось",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0A0A0B] overflow-x-hidden">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(900px 500px at 15% -5%, rgba(0,242,255,0.12), transparent 60%), radial-gradient(700px 500px at 100% 10%, rgba(182,247,0,0.08), transparent 55%), radial-gradient(800px 600px at 50% 110%, rgba(233,179,255,0.10), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-8 w-full max-w-[420px] mx-auto">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-container/50 neon-glow-primary grid place-items-center bg-gradient-to-br from-[#0e3a3d] via-[#0A0A0B] to-[#1a0a2e]">
            <span className="font-display text-3xl font-extrabold text-primary-fixed text-glow-primary">
              N
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-on-surface text-center">
            Nevergiveup
          </h1>
          <p className="font-mono text-[11px] text-on-surface-variant uppercase tracking-widest text-center">
            {mode === "register" ? "Создай аккаунт развития" : "Вход в систему"}
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={submit}
          className="glass-panel rounded-xl p-5 w-full flex flex-col gap-4"
        >
          {mode === "register" && (
            <Field
              label="Имя"
              icon="person"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Endeavorise Eric"
              required
            />
          )}
          <Field
            label="Email"
            icon="alternate_email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
          />
          <Field
            label="Пароль"
            icon="lock"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="мин. 6 символов"
            required
          />

          <button
            type="submit"
            disabled={busy}
            className="mt-2 w-full py-3 rounded-lg bg-primary-container text-on-primary font-display text-[13px] font-bold uppercase tracking-wider neon-glow-primary active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <MaterialIcon name={mode === "register" ? "rocket_launch" : "login"} size={18} fill />
            {busy ? "Выполняется..." : mode === "register" ? "Создать аккаунт" : "Войти"}
          </button>
        </form>

        {/* Switch mode */}
        <div className="mt-5 flex items-center gap-1.5 font-mono text-[11px] text-on-surface-variant">
          <span>
            {mode === "register" ? "Уже есть аккаунт?" : "Нет аккаунта?"}
          </span>
          <button
            onClick={() => router.push(mode === "register" ? "/login" : "/register")}
            className="text-primary-fixed hover:text-primary-container transition-colors uppercase tracking-wider font-bold"
          >
            {mode === "register" ? "Войти" : "Регистрация"}
          </button>
        </div>

        {/* Demo hint */}
        {mode === "login" && (
          <div className="mt-6 w-full rounded-lg border border-outline-variant/30 bg-surface-container/40 p-3">
            <p className="font-mono text-[10px] text-on-surface-variant leading-relaxed">
              <span className="text-primary-fixed-dim uppercase tracking-wider font-bold">Демо-вход:</span>{" "}
              adrian@demo.app / demo1234
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  icon: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-2 bg-surface-container/60 border border-outline-variant/40 rounded-lg px-3 py-2.5 focus-within:border-primary-container/60 focus-within:ring-1 focus-within:ring-primary-container/30 transition-colors">
        <MaterialIcon name={icon} size={18} className="text-on-surface-variant shrink-0" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1 bg-transparent border-0 outline-none font-mono text-[13px] text-on-surface placeholder:text-on-surface-variant/60"
        />
      </div>
    </label>
  );
}
