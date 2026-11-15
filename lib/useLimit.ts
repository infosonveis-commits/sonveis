"use client";
import { useEffect, useState } from "react";

export function leftText(n: number) {
  if (n === 1) return "Осталась 1 бесплатная генерация на сегодня";
  if (n >= 2 && n <= 4) return `Осталось ${n} бесплатных генерации на сегодня`;
  return `Осталось ${n} бесплатных генераций на сегодня`;
}

export function readProfile(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem("sonveis_profile") || "{}"); } catch { return {}; }
}

// Остаток бесплатных генераций хранится на сервере и привязан к браузеру
export function useLimit() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/status").then((r) => r.json()).then((j) => setLeft(j.left)).catch(() => {});
  }, []);
  return { left, setLeft };
}
