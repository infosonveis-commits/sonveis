import { NextResponse } from "next/server";
import { IDEAS } from "@/lib/ideas";
import { DAY_CAP, FREE, IP_CAP, admin, who, withCookie } from "@/lib/server-limit";
import type { Profile } from "@/lib/prompts/common";
import { postPrompt } from "@/lib/prompts/post";
import { ideaPrompt } from "@/lib/prompts/idea";
import { scriptPrompt } from "@/lib/prompts/script";
import { threadsPrompt } from "@/lib/prompts/threads";
import { winbackPrompt } from "@/lib/prompts/winback";

export const maxDuration = 60;

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

const clean = (v: unknown, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: Request) {
  const w = who();
  const reply = (body: object, status = 200) => withCookie(NextResponse.json(body, { status }), w);

  const body = await req.json().catch(() => ({}));
  const cfg = KINDS[body.kind];
  if (!cfg) return reply({ error: "kind" }, 400);
  if (body.kind === "idea" && !(Number.isInteger(body.idea) && body.idea >= 0 && body.idea < IDEAS.length))
    return reply({ error: "kind" }, 400);

  const pr = body.profile || {};
  const profile: Profile = {
    niche: clean(pr.niche), city: clean(pr.city), product: clean(pr.product),
    audience: clean(pr.audience), details: clean(pr.details, 400), tone: pr.tone === "На вы" ? "На вы" : "На ты",
  };
  if (!profile.niche) return reply({ error: "profile" }, 422);

  // Проверка лимитов на сервере: свой лимит браузера, потолок сайта в сутки, лимит IP в час
  const db = admin();
  const { data: took, error: limErr } = await db.rpc("take_generation", {
    p_browser: w.id, p_ip: w.ipHash, p_free: FREE, p_day_cap: DAY_CAP, p_ip_cap: IP_CAP,
  });
  if (limErr || typeof took !== "string") { console.error("limit error:", limErr?.message); return reply({ error: "ai" }, 502); }
  if (took === "limit") return reply({ error: "limit" }, 402);
  if (took === "day") return reply({ error: "day" }, 429);
  if (took === "ip") return reply({ error: "ip" }, 429);
  if (took === "off") return reply({ error: "off" }, 503);
  const left = Math.max(0, parseInt(took.split(":")[1] || "0", 10));

  try {
    const { system, user: prompt } =
      body.kind === "post" ? postPrompt(profile)
      : body.kind === "idea" ? ideaPrompt(profile, IDEAS[body.idea])
      : body.kind === "script" ? scriptPrompt(profile)
      : body.kind === "threads" ? threadsPrompt(profile)
      : winbackPrompt(profile);

    // Просим модель не "размышлять"; если провайдер не знает параметров (400/422), повторяем без них
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
    return reply({ variants, left });
  } catch (e) {
    console.error("AI error:", e instanceof Error ? e.message : e);
    await db.rpc("refund_generation", { p_browser: w.id, p_ip: w.ipHash }); // сбой ИИ не списывает генерацию
    return reply({ error: "ai" }, 502);
  }
}
