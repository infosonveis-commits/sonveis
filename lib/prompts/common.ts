export type Profile = {
  niche: string | null; city: string | null; product: string | null;
  audience: string | null; tone: string | null;
};

// 1) Профиль бизнеса подставляется автоматически
export function profileBlock(p: Profile) {
  const t = p.tone === "На вы" ? "на вы" : "на ты";
  return [
    "ПРОФИЛЬ БИЗНЕСА",
    `Ниша: ${p.niche || "не указана"}`,
    `Город: ${p.city || "не указан"}`,
    `Что продаёт: ${p.product || "не указано"}`,
    `Клиенты: ${p.audience || "не указаны"}`,
    `Обращение к клиентам: ${t}`,
  ].join("\n");
}

// 3) Чёрный список
export const BLACKLIST =
  'ЗАПРЕЩЕНО: фразы "в современном мире", "уникальный", "откройте для себя"; длинное тире (вместо него обычный дефис или точка); эмодзи в каждой строке (лучше без эмодзи, максимум один на весь текст).';

// 5) Общие правила
export const RULES = [
  "ПРАВИЛА",
  "- Короткие фразы. Живая речь, как говорит сам владелец.",
  "- Конкретика из профиля: город, услуги, клиенты.",
  "- Не выдумывай цифры, скидки, акции, отзывы и факты, которых нет в профиле.",
  "- Пиши на русском.",
].join("\n");

export function examplesBlock(examples: string) {
  return examples.trim() ? `ПРИМЕРЫ ХОРОШЕГО ТЕКСТА\n${examples.trim()}` : "";
}

export function pick<T>(a: T[]): T {
  return a[Math.floor(Math.random() * a.length)];
}

// Собирает системный промпт в одном порядке: роль, профиль, чёрный список, примеры, правила, формат
export function compose(role: string, p: Profile, examples: string, format: string) {
  return [role, profileBlock(p), BLACKLIST, examplesBlock(examples), RULES, format].filter(Boolean).join("\n\n");
}
