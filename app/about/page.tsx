import LegalPage from "@/components/LegalPage";
import { SOCIAL } from "@/lib/legal";

const link = "text-blue underline";

export default function Page() {
  return (
    <LegalPage title="О проекте" date={false}>
      <p>Сонвейс помогает владельцам небольшого бизнеса быстро писать посты, сценарии коротких видео, ветки для Threads и сообщения клиентам. Вместо пустого чата с ИИ здесь готовые кнопки.</p>
      <p>Ты отвечаешь на несколько вопросов о своём бизнесе, а тексты подстраиваются под него. Если важно что-то не терять или не придумывать, напиши об этом в необязательном поле «особенности».</p>
      <h2>Наша цель</h2>
      <p>Сделать удобную систему для небольшого бизнеса, где контент для соцсетей создаётся за минуту, без сложных настроек и без пустого окна. Чтобы владелец тратил время на клиентов, а не на придумывание постов.</p>
      <p>Мы развиваем проект вместе с теми, кто им пользуется, и добавляем функции по запросам. Планы могут меняться.</p>
      <h2>Следи за новостями</h2>
      <p>Подписывайся на наш Telegram: там новости, новые функции и ответы на вопросы. Пиши, чего не хватает, мы читаем.</p>
      <ul>
        <li>Telegram: <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer" className={link}>t.me/getsonveis</a></li>
        <li>Instagram: <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className={link}>instagram.com/sonveis</a></li>
        <li>TikTok: <a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" className={link}>tiktok.com/@sonveis</a></li>
      </ul>
      <h2>Это бета</h2>
      <p>Мы тестируем проект: возможны ошибки, а функции могут меняться. Бесплатно доступны 3 генерации в день на браузер, тарифа пока нет. Тексты создаёт ИИ и это черновики, поэтому проверяй их и заменяй придуманные детали своими.</p>
    </LegalPage>
  );
}
