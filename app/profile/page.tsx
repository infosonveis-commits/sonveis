"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/useAuth";
import { sb } from "@/lib/supabase";
import { QS } from "@/lib/questions";

export default function Profile() {
  const a = useAuth();
  const [v, setV] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"" | "saving" | "saved" | "error">("");
  const uid = a.user?.id;

  useEffect(() => {
    if (!uid) return;
    sb().from("profiles").select("niche,city,product,audience,tone").eq("user_id", uid).maybeSingle()
      .then(({ data }) => { if (data) setV(data as Record<string, string>); });
  }, [uid]);

  async function save() {
    if (!uid) return;
    setStatus("saving");
    const row = Object.fromEntries(QS.map((q) => [q.key, (v[q.key] || "").trim()]));
    const { error } = await sb().from("profiles").upsert({ user_id: uid, ...row }, { onConflict: "user_id" });
    setStatus(error ? "error" : "saved");
  }

  return (
    <Shell user={a.user} left={a.left} onSignOut={a.signOut}>
      <div className="mx-auto max-w-xl px-6 pb-10 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Профиль бизнеса</h1>
        {!a.ready ? null : !a.user ? (
          <p className="mt-6 text-ink/70">Чтобы изменить ответы, сначала войди. <Link href="/dashboard" className="text-blue underline">Перейти к кнопкам</Link></p>
        ) : (
          <div className="mt-8 space-y-6">
            {QS.map((q) => (
              <div key={q.key}>
                <label className="font-semibold">{q.title}</label>
                {q.choices ? (
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {q.choices.map((c) => (
                      <button key={c} onClick={() => { setV({ ...v, [q.key]: c }); setStatus(""); }}
                        className={`h-14 rounded-[20px] font-semibold transition ${v[q.key] === c ? "bg-blue text-white" : "bg-mist text-ink"}`}>{c}</button>
                    ))}
                  </div>
                ) : (
                  <input value={v[q.key] ?? ""} placeholder={q.ph} onChange={(e) => { setV({ ...v, [q.key]: e.target.value }); setStatus(""); }}
                    className="mt-2 h-14 w-full rounded-[20px] border-2 border-mist px-5 text-lg outline-none focus:border-blue" />
                )}
              </div>
            ))}
            <button onClick={save} disabled={status === "saving"}
              className="h-16 w-full rounded-[20px] bg-blue text-lg font-semibold text-white transition hover:brightness-110 disabled:opacity-40">
              {status === "saving" ? "Сохраняем..." : "Сохранить"}
            </button>
            {status === "saved" && <p className="text-ink/70" role="status">Сохранено.</p>}
            {status === "error" && <p className="text-red-600" role="alert">Не удалось сохранить. Попробуй ещё раз.</p>}
          </div>
        )}
        <Footer />
      </div>
    </Shell>
  );
}
