import { NextResponse } from "next/server";
import { FREE, admin, who, withCookie } from "@/lib/server-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const w = who();
  const { data } = await admin().rpc("free_left", { p_browser: w.id, p_free: FREE });
  return withCookie(NextResponse.json({ left: typeof data === "number" ? data : FREE }), w);
}
