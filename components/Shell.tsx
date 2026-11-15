"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import WaitlistModal from "@/components/WaitlistModal";
import { leftText } from "@/lib/useLimit";

const ITEM = "rounded-[14px] px-3 py-3 text-left font-medium text-ink/80 transition hover:bg-white";

export default function Shell({ left, children }: { left: number | null; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [wait, setWait] = useState(false);
  return (
    <div className="min-h-screen">
      <header className="flex items-center px-4 py-4 md:hidden">
        <button onClick={() => setOpen(true)} className="h-11 rounded-[14px] bg-mist px-4 font-semibold">Меню</button>
      </header>
      {open && <div className="fixed inset-0 z-30 bg-ink/30 md:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-mist p-5 transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="origin-left scale-75"><Logo /></div>
        <nav className="mt-8 flex flex-col gap-1">
          <Link href="/profile" className={ITEM}>Профиль бизнеса</Link>
          <button onClick={() => { setWait(true); setOpen(false); }} className={ITEM}>Тариф</button>
          <Link href="/about" className={ITEM}>О проекте</Link>
          <Link href="/contacts" className={ITEM}>Контакты</Link>
        </nav>
        <div className="mt-auto">
          <p className="mb-3 min-h-[1.25rem] text-sm text-ink/60">{left === null ? "" : leftText(left)}</p>
          <button onClick={() => { setWait(true); setOpen(false); }} className="h-12 w-full rounded-[14px] bg-blue font-semibold text-white transition hover:brightness-110">Хочу тариф</button>
        </div>
      </aside>

      <main className="md:pl-64">{children}</main>
      {wait && <WaitlistModal onClose={() => setWait(false)} />}
    </div>
  );
}
