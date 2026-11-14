"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/useAuth";

const BTNS = [
  { t: "Пост", d: "3 варианта под твой бизнес" },
  { t: "Сценарий видео", d: "Что сказать и что показать" },
  { t: "Ветка в Threads", d: "Серия коротких постов" },
  { t: "Вернуть клиентов", d: "Сообщение тем, кто пропал" },
];

export default function Dashboard() {
  const a = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (new URLSearchParams(location.search).get("error"))
      setNote("Ссылка устарела или открыта в другом браузере. Нажми любую кнопку и войди заново.");
  }, []);

  function press() {
    if (!a.ready) return;
    if (!a.user) setShowAuth(true);
    else setNote("Эта кнопка заработает на следующем этапе.");
  }

  return (
    <Shell user={a.user} left={a.left} onSignOut={a.signOut}>
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 pb-10 pt-4">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Что делаем сегодня?</h1>
        <p className="mt-3 text-ink/60">
          {a.niche ? <>Твой бизнес: {a.niche}</> : <Link href="/start" className="text-blue underline">Расскажи о своём бизнесе</Link>}
        </p>

        <button onClick={press}
          className="mt-8 flex h-28 w-full flex-col items-start justify-center rounded-[20px] bg-accent px-7 text-left text-white transition hover:brightness-105 active:scale-[0.99]">
          <span className="text-2xl font-extrabold">Идея дня</span>
          <span className="mt-1 text-white/90">Новая тема каждый день</span>
        </button>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {BTNS.map((b) => (
            <button key={b.t} onClick={press}
              className="flex h-28 flex-col items-start justify-center rounded-[20px] bg-blue px-6 text-left text-white transition hover:brightness-110 active:scale-[0.98]">
              <span className="text-xl font-bold">{b.t}</span>
              <span className="mt-1 text-sm text-white/80">{b.d}</span>
            </button>
          ))}
        </div>
        {note && <p className="mt-6 text-ink/60" role="status">{note}</p>}
        <Footer />
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </Shell>
  );
}
