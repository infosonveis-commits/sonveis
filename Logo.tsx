import Link from "next/link";

export function Mark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" aria-hidden>
      <rect width="160" height="160" rx="36" fill="#2F5BEA" />
      <path d="M105.8 52.1A38 38 0 1 0 105.8 107.9" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" />
      <circle cx="123" cy="37" r="12" fill="#FF6B00" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-3" aria-label="Сонвейс, на главную">
      <Mark />
      <span className="text-3xl font-extrabold tracking-tight text-blue">Сонвейс</span>
    </Link>
  );
}
