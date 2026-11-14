"use client";
import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { sb } from "./supabase";

export const FREE_LIMIT = 3;

export function leftText(n: number) {
  if (n === 1) return "Осталась 1 бесплатная генерация";
  if (n >= 2 && n <= 4) return `Осталось ${n} бесплатных генерации`;
  return `Осталось ${n} бесплатных генераций`;
}

// Переносит ответы из браузера в базу после входа
async function syncLocal(uid: string) {
  const c = sb();
  let p: Record<string, string> = {};
  let consent: string | null = null;
  try {
    p = JSON.parse(localStorage.getItem("sonveis_profile") || "{}");
    consent = localStorage.getItem("sonveis_consent_at");
  } catch {}
  const row: Record<string, string> = { user_id: uid };
  for (const k of ["niche", "city", "product", "audience", "tone"]) if (p[k]) row[k] = p[k];
  if (consent) row.consent_at = consent;
  if (Object.keys(row).length > 1) {
    const { error } = await c.from("profiles").upsert(row, { onConflict: "user_id" });
    if (!error) {
      try { localStorage.removeItem("sonveis_profile"); localStorage.removeItem("sonveis_consent_at"); } catch {}
    }
  }
  await c.from("usage").upsert({ user_id: uid, count: 0 }, { onConflict: "user_id", ignoreDuplicates: true });
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [used, setUsed] = useState(0);
  const [niche, setNiche] = useState("");

  const load = useCallback(async () => {
    const c = sb();
    const { data } = await c.auth.getUser();
    const u = data.user;
    setUser(u);
    if (u) {
      await syncLocal(u.id);
      const us = await c.from("usage").select("count").eq("user_id", u.id).maybeSingle();
      setUsed(us.data?.count ?? 0);
      const pr = await c.from("profiles").select("niche").eq("user_id", u.id).maybeSingle();
      setNiche(pr.data?.niche ?? "");
    } else {
      try { setNiche(JSON.parse(localStorage.getItem("sonveis_profile") || "{}").niche || ""); } catch {}
    }
    setReady(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function signOut() {
    await sb().auth.signOut();
    location.href = "/";
  }

  return { user, ready, niche, left: Math.max(0, FREE_LIMIT - used), signOut };
}
