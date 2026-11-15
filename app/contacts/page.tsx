import LegalPage from "@/components/LegalPage";
import { LEGAL as L, SOCIAL } from "@/lib/legal";

export default function Page() {
  return (
    <LegalPage title="Контакты" date={false}>
      <p>Пиши по любым вопросам, ошибкам и идеям.</p>
      <ul>
        <li>Почта: <a href={`mailto:${L.email}`} className="text-blue underline">{L.email}</a></li>
        <li>Telegram: <a href={L.telegram} target="_blank" rel="noopener noreferrer" className="text-blue underline">t.me/getsonveis</a></li>
        <li>Instagram: <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-blue underline">instagram.com/sonveis</a></li>
        <li>TikTok: <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className="text-blue underline">tiktok.com/@sonveis</a></li>
      </ul>
      <p>Если Telegram у тебя не открывается, пиши на почту.</p>
    </LegalPage>
  );
}
