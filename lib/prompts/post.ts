import { BLACKLIST, DEFAULT_POST_EXAMPLES, RULES, examplesBlock, profileBlock, type Profile } from "./common";

// 4) ВСТАВЬ СЮДА 2-3 примера хорошего поста под нишу (между кавычками-обратными апострофами).
// Пока пусто, блок с примерами просто не добавляется в промпт.
const EXAMPLES = ``;

// Разные углы, чтобы "Переделать" давало новое, а не то же самое
const ANGLES = [
  "случай из работы",
  "полезный совет клиентам",
  "ответ на частый вопрос клиентов",
  "как всё устроено за кулисами",
  "почему клиенты возвращаются",
];

export function postPrompt(p: Profile) {
  const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
  const system = [
    // 2) Роль
    "Ты пишешь посты для соцсетей от лица владельца микробизнеса. Это живая речь человека, не реклама и не штамп.",
    profileBlock(p),
    BLACKLIST,
    examplesBlock(EXAMPLES || DEFAULT_POST_EXAMPLES),
    RULES,
    "ФОРМАТ ОТВЕТА\nДай ровно 3 разных варианта поста. Разделяй их отдельной строкой ---. Без заголовков, нумерации и пояснений.",
  ].filter(Boolean).join("\n\n");
  const user = `Напиши 3 варианта поста. Угол: ${angle}.`;
  return { system, user };
}
