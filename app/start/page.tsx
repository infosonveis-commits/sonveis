"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { QS } from "@/lib/questions";

export default function Start() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Record<string, string>>({});
  const q = QS[step];
  const value = a[q.key] || "";

  function finish(next: Record<string, string>) {
    try { localStorage.setItem("sonveis_profile", JSON.stringify(next)); } catch {}
    router.push("/dashboard");
  }
  function next(v?: string) {
    const upd = { ...a, [q.key]: (v ?? value).trim() };
    setA(upd);
    if (step === QS.length - 1) finish(upd); else setStep(step + 1);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col px-6 py-6">
      <header><Logo /></header>
      <div className="mt-10 flex gap-2" aria-label={`Вопрос ${step + 1} из ${QS.length}`}>
        {QS.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-blue" : "bg-mist"}`} />
        ))}
      </div>
      <section className="flex flex-1 flex-col justify-center pb-24">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">{q.title}</h1>
        <p className="mt-3 text-ink/60">{q.hint}</p>
        {q.choices ? (
          <div className="mt-10 grid grid-cols-2 gap-4">
            {q.choices.map((c) => (
              <button key={c} onClick={() => next(c)}
                className="h-24 rounded-[20px] bg-blue text-xl font-semibold text-white transition hover:brightness-110 active:scale-[0.98]">
                {c}
              </button>
            ))}
          </div>
        ) : (
          <>
            <input key={q.key} autoFocus value={value} placeholder={q.ph}
              onChange={(e) => setA({ ...a, [q.key]: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) next(); }}
              className="mt-10 h-16 w-full rounded-[20px] border-2 border-mist bg-white px-5 text-lg outline-none focus:border-blue" />
            <button onClick={() => next()} disabled={!value.trim()}
              className="mt-4 h-16 w-full rounded-[20px] bg-blue text-lg font-semibold text-white transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:opacity-30">
              Дальше
            </button>
          </>
        )}
        {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-6 self-start text-ink/60 hover:text-ink">Назад</button>}
      </section>
    </main>
  );
}
