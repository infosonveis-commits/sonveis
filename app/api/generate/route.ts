import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { IDEAS } from "@/lib/ideas";
import type { Profile } from "@/lib/prompts/common";
import { postPrompt } from "@/lib/prompts/post";
import { ideaPrompt } from "@/lib/prompts/idea";
import { scriptPrompt } from "@/lib/prompts/script";
import { threadsPrompt } from "@/lib/prompts/threads";
import { winbackPrompt } from "@/lib/prompts/winback";

export const maxDuration = 60;
const FREE_LIMIT = 3;

const json = (body: object, status = 200) => NextResponse.json(body, { status });

// Провайдер ИИ настраивается переменными в Vercel (адрес, модель, ключ)
const BASE = (process.env.AI_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
const MODEL = process.env.AI_MODEL || "deepseek-v4-flash";
const KEY = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY;

// split: делить ответ на части по ---, max: сколько частей оставить, tokens: лимит ответа
const KINDS: Record<string, { split: boolean; max: number; tokens: number }> = {
  post: { split: true, max: 3, tokens: 2500 },
  idea: { split: false, max: 1, tokens: 1500 },
  script: { split: false, max: 1, tokens: 2000 },
  threads: { split: true, max: 6, tokens: 2500 },
  winback: { split: true, max: 3, tokens: 1500 },
};

export async function POST(req: Request) {
  const store = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => store.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json({ error: "auth" }, 401);

  const body = await req.json().catch(() => ({}));
  const kind: string = body.kind;
  const cfg = KINDS[kind];
  if (!cfg) return json({ error: "kind" }, 400);
  if (kind === "idea" && !(Number.isInteger(body.idea) && body.idea >= 0 && body.idea < IDEAS.length))
    return json({ error: "kind" }, 400);

  const { data: profile } = await supabase
    .from("profiles").select("niche,city,product,audience,tone").eq("user_id", user.id).maybeSingle();
  if (!profile?.niche) return json({ error: "profile" }, 422);

  // Проверка лимита на сервере: счётчик растёт только если лимит не исчерпан
  const { data: used } = await supabase.rpc("increment_usage");
  if (used === null || used === undefined) return json({ error: "limit" }, 402);

  try {
    const p = profile as Profile;
    const { system, user: prompt } =
      kind === "post" ? postPrompt(p)
      : kind === "idea" ? ideaPrompt(p, IDEAS[body.idea])
      : kind === "script" ? scriptPrompt(p)
      : kind === "threads" ? threadsPrompt(p)
      : winbackPrompt(p);

    // Просим модель не "размышлять" (иначе размышления съедают лимит и ответ обрывается).
    // Если провайдер не знает этих параметров (ошибка 400/422), повторяем без них.
    const ask = (hints: boolean) => fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        ...(hints ? { thinking: { type: "disabled" }, reasoning_effort: "none" } : {}),
        max_tokens: cfg.tokens,
        temperature: 0.9,
        messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(50000),
    });
    let r = await ask(true);
    if (r.status === 400 || r.status === 422) r = await ask(false);
    if (!r.ok) throw new Error(`AI ${r.status} ${(await r.text().catch(() => "")).slice(0, 300)}`);
    const j = await r.json();
    const choice = j.choices?.[0];
    console.log("AI ok:", choice?.finish_reason, JSON.stringify(j.usage));
    if (choice?.finish_reason === "length") throw new Error("cut: ответ обрезан по лимиту");
    const text: string = (choice?.message?.content || "").trim().replace(/[—–]/g, "-");
    if (!text) throw new Error("empty");
    const variants = cfg.split
      ? text.split(/\n\s*-{3,}\s*\n/).map((s) => s.trim()).filter(Boolean).slice(0, cfg.max)
      : [text];
    return json({ variants, left: Math.max(0, FREE_LIMIT - used) });
  } catch (e) {
    console.error("AI error:", e instanceof Error ? e.message : e);
    await supabase.rpc("refund_usage"); // ошибка ИИ не должна списывать генерацию
    return json({ error: "ai" }, 502);
  }
}
