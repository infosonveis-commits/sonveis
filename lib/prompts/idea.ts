import { DEFAULT_POST_EXAMPLES, compose, type Profile } from "./common";

// 4) ВСТАВЬ СЮДА 2-3 примера хорошего поста под нишу
const EXAMPLES = ``;

export function ideaPrompt(p: Profile, topic: string) {
  const system = compose(
    "Ты пишешь пост для соцсетей от лица владельца микробизнеса. Это живая речь человека, не реклама и не штамп.",
    p, EXAMPLES || DEFAULT_POST_EXAMPLES,
    "ФОРМАТ ОТВЕТА\nДай ровно один готовый пост. Без заголовка и пояснений. Если тема просит рассказать, как работает бизнес, а нужных фактов в профиле нет, дай общий совет по теме без утверждений о том, что делаешь именно ты."
  );
  return { system, user: `Тема поста: ${topic}.` };
}
