"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/useAuth";
import { IDEAS } from "@/lib/ideas";

type Req = { kind: string; idea?: number };

const BTNS = [
  { k: "post", t: "Пост", d: "3 варианта под твой бизнес" },
  { k: "script", t: "Сценарий видео", d: "Что сказать и что показать" },
  { k: "threads", t: "Ветка в Threads", d: "Серия коротких постов" },
  { k: "winback", t: "Вернуть клиентов", d: "Сообщение тем, кто пропал" },
];
const TITLES: Record<string, string> = {
  post: "Посты", idea: "Идея дня", script: "Сценарий видео", threads: "Ветка в Threads", winback: "Сообщения клиентам",
};
const LIMIT_NOTE = 'Бесплатные генерации закончились. Нажми "Хочу тариф" в меню.';

export default function Dashboard() {
  const a = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ req: Req; variants: string[] } | null>(null);
  const [copied, setCopied] = useState(-1);
  const [day, setDay] = useState<number | null>(null);

  useEffect(() => {
    const n = new Date();
    const d = Math.floor((n.getTime() - new Date(n.getFullYear(), 0, 0).getTime()) / 86400000);
    setDay(d % IDEAS.length);
    if (new URLSearchParams(location.search).get("error"))
      setNote("Ссылка устарела или открыта в другом браузере. Нажми любую кнопку и войди заново.");
  }, []);

  async function generate(req: Req) {
    setNote(""); setLoading(true); setCopied(-1);
    try {
      const call = () => fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req),
      });
      let r = await call();
      if (r.status === 502) r = await call(); // сбой ИИ: одна автоматическая повторная попытка (генерация возвращается)
      const j = await r.json().catch(() => ({}));
      if (r.ok) { setResult({ req, variants: j.variants }); a.setLeft(j.left); }
      else if (r.status === 401) setShowAuth(true);
      else if (r.status === 402) { a.setLeft(0); setNote(LIMIT_NOTE); }
      else if (r.status === 422) setNote("Сначала ответь на вопросы о бизнесе.");
      else setNote("Не получилось написать. Попробуй ещё раз, генерация не потрачена.");
    } catch {
      setNote("Нет связи. Попробуй ещё раз.");
    }
    setLoading(false);
  }

  function press(req: Req) {
    if (!a.ready || loading) return;
    if (!a.user) return setShowAuth(true);
    if (a.left <= 0) return setNote(LIMIT_NOTE);
    generate(req);
  }

  async function copy(text: string, i: number) {
    try { await navigator.clipboard.writeText(text); setCopied(i); } catch {}
  }

  return (
    <Shell user={a.user} left={a.left} onSignOut={a.signOut}>
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 pb-10 pt-4 md:justify-center">
        {result ? (
          <section>
            <button onClick={() => setResult(null)} className="text-ink/60 hover:text-ink">Назад</button>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{TITLES[result.req.kind]}</h1>
            {result.req.kind === "idea" && result.req.idea !== undefined && (
              <p className="mt-2 text-ink/60">{IDEAS[result.req.idea]}</p>
            )}
            <div className="mt-6 space-y-4">
              {result.variants.map((v, i) => (
                <article key={i} className="rounded-[20px] bg-mist p-5">
                  {result.req.kind === "threads" && (
                    <p className="mb-2 text-sm font-semibold text-blue">{i + 1}/{result.variants.length}</p>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{v}</p>
                  <button onClick={() => copy(v, i)} className="mt-4 h-11 rounded-[14px] bg-white px-5 font-semibold transition hover:brightness-95">
                    {copied === i ? "Скопировано" : "Копировать"}
                  </button>
                </article>
              ))}
            </div>
            <button onClick={() => press(result.req)} disabled={loading || a.left <= 0}
              className="mt-6 h-16 w-full rounded-[20px] bg-blue text-lg font-semibold text-white transition enabled:hover:brightness-110 disabled:opacity-40">
              {loading ? "Пишем..." : "Переделать"}
            </button>
            <p className="mt-3 text-sm text-ink/50">Каждая генерация списывается из бесплатных.</p>
            {note && <p className="mt-4 text-ink/60" role="status">{note}</p>}
          </section>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Что делаем сегодня?</h1>
            <p className="mt-3 text-ink/60">
              {a.niche ? <>Твой бизнес: {a.niche}</> : <Link href="/start" className="text-blue underline">Расскажи о своём бизнесе</Link>}
            </p>
            <button onClick={() => press({ kind: "idea", idea: day ?? 0 })} disabled={loading || day === null}
              className="mt-8 flex min-h-[7rem] w-full flex-col items-start justify-center rounded-[20px] bg-accent px-7 py-4 text-left text-white transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60">
              <span className="text-2xl font-extrabold">Идея дня</span>
              <span className="mt-1 text-white/90">{day === null ? "Новая тема каждый день" : IDEAS[day]}</span>
            </button>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {BTNS.map((b) => (
                <button key={b.k} onClick={() => press({ kind: b.k })} disabled={loading}
                  className="flex h-28 flex-col items-start justify-center rounded-[20px] bg-blue px-6 text-left text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
                  <span className="text-xl font-bold">{b.t}</span>
                  <span className="mt-1 text-sm text-white/80">{b.d}</span>
                </button>
              ))}
            </div>
            {loading && <p className="mt-6 text-ink/60" role="status">Пишем текст, это может занять до 30 секунд.</p>}
            {!loading && note && <p className="mt-6 text-ink/60" role="status">{note}</p>}
          </>
        )}
        <Footer />
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </Shell>
  );
}
