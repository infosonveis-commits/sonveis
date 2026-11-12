"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const BTNS = [
  { t: "Пост", d: "3 варианта под твой бизнес" },
  { t: "Сценарий видео", d: "Что сказать и что показать" },
  { t: "Ветка в Threads", d: "Серия коротких постов" },
  { t: "Вернуть клиентов", d: "Сообщение тем, кто пропал" },
];
const MENU = ["Профиль бизнеса", "Тариф", "О проекте", "Контакты"];

export default function Dashboard() {
  const [niche, setNiche] = useState("");
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(false);

  useEffect(() => {
    try { setNiche(JSON.parse(localStorage.getItem("sonveis_profile") || "{}").niche || ""); } catch {}
  }, []);

  return (
    <div className="min-h-screen">
      <header className="flex items-center px-4 py-4 md:hidden">
        <button onClick={() => setOpen(true)} className="h-11 rounded-[14px] bg-mist px-4 font-semibold">Меню</button>
      </header>
      {open && <div className="fixed inset-0 z-30 bg-ink/30 md:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-mist p-5 transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="scale-75 origin-left"><Logo /></div>
        <nav className="mt-8 flex flex-col gap-1">
          {MENU.map((m) => (
            <button key={m} className="rounded-[14px] px-3 py-3 text-left font-medium text-ink/80 transition hover:bg-white">{m}</button>
          ))}
        </nav>
        <div className="mt-auto">
          <p className="mb-3 text-sm text-ink/60">Осталось 3 бесплатных генерации</p>
          <button className="h-12 w-full rounded-[14px] bg-blue font-semibold text-white transition hover:brightness-110">Хочу тариф</button>
        </div>
      </aside>

      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 pb-16 pt-4 md:pl-72 md:pr-6">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Что делаем сегодня?</h1>
        <p className="mt-3 text-ink/60">
          {niche ? <>Твой бизнес: {niche}</> : <Link href="/start" className="text-blue underline">Расскажи о своём бизнесе</Link>}
        </p>

        <button onClick={() => setNote(true)}
          className="mt-8 flex h-28 w-full flex-col items-start justify-center rounded-[20px] bg-accent px-7 text-left text-white transition hover:brightness-105 active:scale-[0.99]">
          <span className="text-2xl font-extrabold">Идея дня</span>
          <span className="mt-1 text-white/90">Новая тема каждый день</span>
        </button>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {BTNS.map((b) => (
            <button key={b.t} onClick={() => setNote(true)}
              className="flex h-28 flex-col items-start justify-center rounded-[20px] bg-blue px-6 text-left text-white transition hover:brightness-110 active:scale-[0.98]">
              <span className="text-xl font-bold">{b.t}</span>
              <span className="mt-1 text-sm text-white/80">{b.d}</span>
            </button>
          ))}
        </div>
        {note && <p className="mt-6 text-ink/60" role="status">Кнопки заработают на следующих этапах.</p>}
      </main>
    </div>
  );
}
