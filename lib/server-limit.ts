import { createClient } from "@supabase/supabase-js";
import { createHash, randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import type { NextResponse } from "next/server";

export const FREE = 3;                              // бесплатных генераций на браузер
export const DAY_CAP = Number(process.env.DAILY_CAP) || 100; // потолок генераций на весь сайт в сутки
export const IP_CAP = 10;                           // генераций в час с одного IP

// Серверный доступ к базе (секретный ключ, только в Vercel, никогда в браузер)
export function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false },
  });
}

// Кто пришёл: случайный номер браузера из cookie и обезличенный хэш IP
export function who() {
  const existing = cookies().get("sv_id")?.value;
  const valid = !!existing && /^[0-9a-f-]{36}$/i.test(existing);
  const ip = (headers().get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const ipHash = createHash("sha256").update(ip + (process.env.SUPABASE_SECRET_KEY || "")).digest("hex").slice(0, 32);
  return { id: valid ? existing! : randomUUID(), isNew: !valid, ipHash };
}

export function withCookie(res: NextResponse, w: { id: string; isNew: boolean }) {
  if (w.isNew)
    res.cookies.set("sv_id", w.id, {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 31536000,
      secure: process.env.NODE_ENV === "production",
    });
  return res;
}
