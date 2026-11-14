"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { sb } from "@/lib/supabase";

export default function StartButton() {
  const [signed, setSigned] = useState(false);
  useEffect(() => {
    sb().auth.getSession().then(({ data }) => setSigned(!!data.session));
  }, []);
  return (
    <Link href={signed ? "/dashboard" : "/start"}
      className="mt-10 inline-flex h-16 items-center rounded-[20px] bg-blue px-10 text-lg font-semibold text-white transition hover:brightness-110 active:scale-[0.98]">
      {signed ? "Открыть" : "Начать"}
    </Link>
  );
}
