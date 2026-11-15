"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import Footer from "@/components/Footer";
import { QS } from "@/lib/questions";
import { readProfile, useLimit } from "@/lib/useLimit";

export default function Profile() {
  const { left } = useLimit();
  const [v, setV] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { setV(readProfile()); }, []);

  function save() {
    const row = Object.fromEntries(QS.map((q) => [q.key, (v[q.key] || "").trim()]));
    try { localStorage.setItem("sonveis_profile", JSON.stringify(row)); setSaved(true); } catch {}
  }

  return (
    <Shell left={left}>
      <div className="mx-auto max-w-xl px-6 pb-10 pt-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Профиль бизнеса</h1>
        <p className="mt-3 text-ink/60">Ответы хранятся в твоём браузере. На сервере мы их не сохраняем.</p>
        <div className="mt-8 space-y-6">
          {QS.map((q) => (
            <div key={q.key}>
              <label className="font-semibold">{q.title}{q.optional && <span className="font-normal text-ink/50"> (необязательно)</span>}</label>
              {q.choices ? (
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {q.choices.map((c) => (
                    <button key={c} onClick={() => { setV({ ...v, [q.key]: c }); setSaved(false); }}
                      className={`h-14 rounded-[20px] font-semibold transition ${v[q.key] === c ? "bg-blue text-white" : "bg-mist text-ink"}`}>{c}</button>
                  ))}
                </div>
              ) : (
                <input value={v[q.key] ?? ""} placeholder={q.ph} onChange={(e) => { setV({ ...v, [q.key]: e.target.value }); setSaved(false); }}
                  className="mt-2 h-14 w-full rounded-[20px] border-2 border-mist px-5 text-lg outline-none focus:border-blue" />
              )}
            </div>
          ))}
          <button onClick={save}
            className="h-16 w-full rounded-[20px] bg-blue text-lg font-semibold text-white transition hover:brightness-110">Сохранить</button>
          {saved && <p className="text-ink/70" role="status">Сохранено.</p>}
        </div>
        <Footer />
      </div>
    </Shell>
  );
}
