"use client";
import { useState } from "react";
import { sb } from "@/lib/supabase";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const ok = /^\S+@\S+\.\S+$/.test(email.trim()) && c1 && c2 && state !== "loading";

  async function send() {
    setState("loading");
    try { localStorage.setItem("sonveis_consent_at", new Date().toISOString()); } catch {}
    const { error } = await sb().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setState(error ? "error" : "sent");
  }

  const link = "text-blue underline";
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {state === "sent" ? (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight">Проверь почту</h2>
            <p className="mt-3 text-ink/70">Мы отправили ссылку на {email.trim()}. Открой её в этом же браузере. Если письма нет, посмотри в папке "Спам".</p>
            <button onClick={onClose} className="mt-6 h-14 w-full rounded-[20px] bg-mist font-semibold">Закрыть</button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight">Сохрани результат</h2>
            <p className="mt-2 text-ink/70">Введи почту, мы пришлём ссылку для входа. Пароль не нужен.</p>
            <input type="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Твоя почта"
              className="mt-5 h-14 w-full rounded-[20px] border-2 border-mist px-5 text-lg outline-none focus:border-blue" />
            <label className="mt-5 flex items-start gap-3">
              <input type="checkbox" checked={c1} onChange={(e) => setC1(e.target.checked)} className="mt-1 h-5 w-5 accent-blue" />
              <span className="text-sm text-ink/80">Согласен с <a href="/privacy" target="_blank" className={link}>Политикой конфиденциальности</a></span>
            </label>
            <label className="mt-3 flex items-start gap-3">
              <input type="checkbox" checked={c2} onChange={(e) => setC2(e.target.checked)} className="mt-1 h-5 w-5 accent-blue" />
              <span className="text-sm text-ink/80">Согласен с <a href="/terms" target="_blank" className={link}>Условиями использования</a></span>
            </label>
            {state === "error" && <p className="mt-4 text-sm text-red-600" role="alert">Не получилось отправить письмо. Подожди минуту и попробуй снова.</p>}
            <button onClick={send} disabled={!ok}
              className="mt-6 h-14 w-full rounded-[20px] bg-blue text-lg font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-30">
              {state === "loading" ? "Отправляем..." : "Получить ссылку"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
