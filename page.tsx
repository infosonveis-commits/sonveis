import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <svg aria-hidden viewBox="0 0 160 160" fill="none"
        className="pointer-events-none absolute -right-48 top-1/2 h-[760px] w-[760px] -translate-y-1/2 text-blue/10">
        <path d="M105.8 52.1A38 38 0 1 0 105.8 107.9" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
      </svg>
      <header className="relative mx-auto max-w-5xl px-6 py-6">
        <Logo />
      </header>
      <section className="relative mx-auto max-w-5xl px-6 pb-24 pt-14 md:pt-28">
        <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          Посты и сценарии для твоего бизнеса в один клик
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          Ответь на 5 коротких вопросов. Получай тексты, которые звучат как ты, а не как робот.
        </p>
        <Link href="/start"
          className="mt-10 inline-flex h-16 items-center rounded-[20px] bg-blue px-10 text-lg font-semibold text-white transition hover:brightness-110 active:scale-[0.98]">
          Начать
        </Link>
      </section>
    </main>
  );
}
