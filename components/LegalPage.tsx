import Link from "next/link";
import Logo from "@/components/Logo";
import { LEGAL } from "@/lib/legal";

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-6">
      <Logo />
      <h1 className="mt-12 text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">Редакция от {LEGAL.date}</p>
      <div className="mt-8 space-y-4 leading-relaxed text-ink/80 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
        {children}
      </div>
      <Link href="/" className="mt-12 inline-block text-blue underline">На главную</Link>
    </main>
  );
}
