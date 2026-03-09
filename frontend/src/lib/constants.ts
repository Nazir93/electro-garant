export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Гарант Монтаж";
export const CITY = process.env.NEXT_PUBLIC_CITY || "Сочи";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const PHONE = "+7 (495) 000-00-00";
export const PHONE_RAW = "+74950000000";
export const EMAIL = "info@garantmontazh.ru";
export const ADDRESS = "Сочи, ул. Примерная, д. 1, офис 100";
export const WORKING_HOURS = "Пн–Пт 09:00–18:00, Сб по записи";

export const SOCIAL_LINKS = {
  telegram: "https://t.me/garantmontazh",
  whatsapp: "https://wa.me/74950000000",
  vk: "https://vk.com/garantmontazh",
};

export const SERVICES = [
  {
    id: "acoustics",
    slug: "/services/acoustics",
    title: "Коммерческая акустика",
    shortDescription:
      "Проектирование и монтаж звуковых систем для ресторанов, магазинов и офисов. Чистый звук в каждой зоне.",
    icon: "speaker" as const,
  },
  {
    id: "electrical",
    slug: "/services/electrical",
    title: "Электромонтажные работы",
    shortDescription:
      "Силовые сети, щитовое оборудование, освещение. Полный цикл от проекта до пусконаладки.",
    icon: "zap" as const,
  },
  {
    id: "structured-cabling",
    slug: "/services/structured-cabling",
    title: "Слаботочные системы",
    shortDescription:
      "Структурированные кабельные сети, интернет, телефония. Надёжная IT-инфраструктура для бизнеса.",
    icon: "network" as const,
  },
  {
    id: "smart-home",
    slug: "/services/smart-home",
    title: "Умный дом",
    shortDescription:
      "Автоматизация освещения, климата и мультимедиа. Управление всем домом с одного экрана.",
    icon: "home" as const,
  },
  {
    id: "security",
    slug: "/services/security",
    title: "Видеонаблюдение и безопасность",
    shortDescription:
      "IP-камеры, контроль доступа, охранные системы. Круглосуточный контроль объекта с телефона.",
    icon: "shield" as const,
  },
] as const;

export const STATS = [
  { value: 12, label: "лет на рынке Сочи", suffix: "" },
  { value: 280, label: "объектов сдано", suffix: "+" },
  { value: 15000, label: "м² обслуживаемая площадь", suffix: "+" },
  { value: 5, label: "лет гарантия на работы", suffix: "" },
] as const;
