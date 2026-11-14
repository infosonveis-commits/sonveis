import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { postPrompt } from "@/lib/prompts/post";

export const maxDuration = 30;
const FREE_LIMIT = 3;

const json = (body: object, status = 200) => NextResponse.json(body, { status });

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
  if (body.kind !== "post") return json({ error: "kind" }, 400);

  const { data: profile } = await supabase
    .from("profiles").select("niche,city,product,audience,tone").eq("user_id", user.id).maybeSingle();
  if (!profile?.niche) return json({ error: "profile" }, 422);

  // Проверка лимита на сервере: счётчик растёт только если лимит не исчерпан
  const { data: used } = await supabase.rpc("increment_usage");
  if (used === null || used === undefined) return json({ error: "limit" }, 402);

  try {
    const { system, user: prompt } = postPrompt(profile);
    const r = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-v4-flash",
        thinking: { type: "disabled" },
        max_tokens: 1200,
        temperature: 0.9,
        messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!r.ok) throw new Error(`deepseek ${r.status}`);
    const j = await r.json();
    const text: string = (j.choices?.[0]?.message?.content || "").trim();
    if (!text) throw new Error("empty");
    const variants = text.replace(/[—–]/g, "-").split(/\n\s*-{3,}\s*\n/).map((s) => s.trim()).filter(Boolean).slice(0, 3);
    return json({ variants, left: Math.max(0, FREE_LIMIT - used) });
  } catch {
    await supabase.rpc("refund_usage"); // ошибка ИИ не должна списывать генерацию
    return json({ error: "ai" }, 502);
  }
}
