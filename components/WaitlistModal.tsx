"use client";
import { useState } from "react";
import { sb } from "@/lib/supabase";

export default function WaitlistModal({ email: initial, onClose }: { email?: string | null; onClose: () => void }) {
  const [email, setEmail] = useState(initial || "");
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const ok = /^\S+@\S+\.\S+$/.test(email.trim()) && agree && state !== "loading";

  async function send() {
    setState("loading");
    const { error } = await sb().from("waitlist").insert({ email: email.trim().toLowerCase() });
    // 23505: такая почта уже есть, для человека это тоже успех
    setState(error && error.code !== "23505" ? "error" : "done");
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {state === "done" ? (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight">Записали</h2>
            <p className="mt-3 text-ink/70">Напишем, когда появится тариф.</p>
            <button onClick={onClose} className="mt-6 h-14 w-full rounded-[20px] bg-mist font-semibold">Закрыть</button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold tracking-tight">Хочу тариф</h2>
            <p className="mt-2 text-ink/70">Оставь почту, и мы напишем, когда тариф будет готов.</p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Твоя почта"
              className="mt-5 h-14 w-full rounded-[20px] border-2 border-mist px-5 text-lg outline-none focus:border-blue" />
            <label className="mt-5 flex items-start gap-3">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-blue" />
              <span className="text-sm text-ink/80">Согласен получить одно сообщение о тарифе и с <a href="/privacy" target="_blank" className="text-blue underline">Политикой конфиденциальности</a></span>
            </label>
            {state === "error" && <p className="mt-4 text-sm text-red-600" role="alert">Не получилось записать. Попробуй ещё раз.</p>}
            <button onClick={send} disabled={!ok}
              className="mt-6 h-14 w-full rounded-[20px] bg-blue text-lg font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-30">
              {state === "loading" ? "Записываем..." : "Записаться"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
