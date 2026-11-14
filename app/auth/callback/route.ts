import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const fail = NextResponse.redirect(new URL("/dashboard?error=1", url.origin));
  if (!code) return fail;

  const res = NextResponse.redirect(new URL("/dashboard", url.origin));
  const store = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (list: { name: string; value: string; options: CookieOptions }[]) =>
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    }
  );
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  return error ? fail : res;
}
