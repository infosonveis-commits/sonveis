"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { readProfile } from "@/lib/useLimit";

export default function StartButton() {
  const [has, setHas] = useState(false);
  useEffect(() => { setHas(!!readProfile().niche); }, []);
  return (
    <Link href={has ? "/dashboard" : "/start"}
      className="mt-10 inline-flex h-16 items-center rounded-[20px] bg-blue px-10 text-lg font-semibold text-white transition hover:brightness-110 active:scale-[0.98]">
      {has ? "Открыть" : "Начать"}
    </Link>
  );
}
