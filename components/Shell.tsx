"use client";
import { useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import Logo from "@/components/Logo";
import { leftText } from "@/lib/useAuth";

const ITEM = "rounded-[14px] px-3 py-3 text-left font-medium text-ink/80 transition hover:bg-white";

export default function Shell({ user, left, onSignOut, children }: {
  user: User | null; left: number; onSignOut: () => void; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
          <button className={ITEM}>Тариф</button>
          <button className={ITEM}>О проекте</button>
          <button className={ITEM}>Контакты</button>
        </nav>
        <div className="mt-auto">
          <p className="mb-3 text-sm text-ink/60">{leftText(left)}</p>
          <button className="h-12 w-full rounded-[14px] bg-blue font-semibold text-white transition hover:brightness-110">Хочу тариф</button>
          {user && (
            <div className="mt-4 border-t border-ink/10 pt-4">
              <p className="truncate text-sm text-ink/60">{user.email}</p>
              <button onClick={onSignOut} className="mt-2 font-medium text-ink/80 hover:text-ink">Выйти</button>
            </div>
          )}
        </div>
      </aside>

      <main className="md:pl-64">{children}</main>
    </div>
  );
}
