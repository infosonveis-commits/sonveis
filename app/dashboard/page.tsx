"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/useAuth";

const BTNS = [
  { k: "post", t: "Пост", d: "3 варианта под твой бизнес" },
  { k: "script", t: "Сценарий видео", d: "Что сказать и что показать" },
  { k: "threads", t: "Ветка в Threads", d: "Серия коротких постов" },
  { k: "winback", t: "Вернуть клиентов", d: "Сообщение тем, кто пропал" },
];

export default function Dashboard() {
  const a = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [copied, setCopied] = useState(-1);

  useEffect(() => {
    if (new URLSearchParams(location.search).get("error"))
      setNote("Ссылка устарела или открыта в другом браузере. Нажми любую кнопку и войди заново.");
  }, []);

  async function generate() {
    setNote(""); setLoading(true); setCopied(-1);
    try {
      const r = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "post" }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { setResult(j.variants); a.setLeft(j.left); }
      else if (r.status === 401) setShowAuth(true);
      else if (r.status === 402) { a.setLeft(0); setNote('Бесплатные генерации закончились. Нажми "Хочу тариф" в меню.'); }
      else if (r.status === 422) setNote("Сначала ответь на вопросы о бизнесе.");
      else setNote("Не получилось написать. Попробуй ещё раз, генерация не потрачена.");
    } catch {
      setNote("Нет связи. Попробуй ещё раз.");
    }
    setLoading(false);
  }

  function press(k: string) {
    if (!a.ready || loading) return;
    if (!a.user) return setShowAuth(true);
    if (k !== "post") return setNote("Эта кнопка заработает на следующем этапе.");
    if (a.left <= 0) return setNote('Бесплатные генерации закончились. Нажми "Хочу тариф" в меню.');
    generate();
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
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Посты</h1>
            <div className="mt-6 space-y-4">
              {result.map((v, i) => (
                <article key={i} className="rounded-[20px] bg-mist p-5">
                  <p className="whitespace-pre-wrap leading-relaxed">{v}</p>
                  <button onClick={() => copy(v, i)} className="mt-4 h-11 rounded-[14px] bg-white px-5 font-semibold transition hover:brightness-95">
                    {copied === i ? "Скопировано" : "Копировать"}
                  </button>
                </article>
              ))}
            </div>
            <button onClick={generate} disabled={loading || a.left <= 0}
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
            <button onClick={() => press("idea")} disabled={loading}
              className="mt-8 flex h-28 w-full flex-col items-start justify-center rounded-[20px] bg-accent px-7 text-left text-white transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60">
              <span className="text-2xl font-extrabold">Идея дня</span>
              <span className="mt-1 text-white/90">Новая тема каждый день</span>
            </button>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {BTNS.map((b) => (
                <button key={b.k} onClick={() => press(b.k)} disabled={loading}
                  className="flex h-28 flex-col items-start justify-center rounded-[20px] bg-blue px-6 text-left text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60">
                  <span className="text-xl font-bold">{b.t}</span>
                  <span className="mt-1 text-sm text-white/80">{b.d}</span>
                </button>
              ))}
            </div>
            {loading && <p className="mt-6 text-ink/60" role="status">Пишем текст, это займёт до 20 секунд.</p>}
            {!loading && note && <p className="mt-6 text-ink/60" role="status">{note}</p>}
          </>
        )}
        <Footer />
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </Shell>
  );
}
