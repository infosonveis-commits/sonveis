import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/50">
      <Link href="/privacy" className="hover:text-ink">Политика конфиденциальности</Link>
      <Link href="/consent" className="hover:text-ink">Согласие на обработку данных</Link>
      <Link href="/terms" className="hover:text-ink">Условия использования</Link>
      <span>Тексты создаёт ИИ, проверяй перед публикацией</span>
    </footer>
  );
}
