import Link from "next/link";
import Logo from "@/components/Logo";

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-6">
      <Logo />
      <h1 className="mt-14 text-4xl font-extrabold tracking-tight">Условия использования</h1>
      <p className="mt-6 text-lg text-ink/70">Здесь будет текст</p>
      <Link href="/" className="mt-10 inline-block text-blue underline">На главную</Link>
    </main>
  );
}
