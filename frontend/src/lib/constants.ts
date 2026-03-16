export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Гарант Монтаж";
export const CITY = process.env.NEXT_PUBLIC_CITY || "Сочи";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const PHONE = "8 (928) 455-455-9";
export const PHONE_RAW = "89284554559";
export const EMAIL = "garantmontaj@gmail.com";
export const ADDRESS = "Краснодарский край, г. Сочи, ул. Пасечная 61/2, кв. 48";
export const WORKING_HOURS = "Пн–Пт 09:00–18:00, Сб по записи";

export const COMPANY = {
  fullName: "Индивидуальный предприниматель Чернышева Елена Михайловна",
  shortName: "ИП Чернышева Е. М.",
  inn: "232013211085",
  ogrnip: "314236632900029",
  postalAddress: "354068, Краснодарский край, г. Сочи, ул. Пасечная 61/2, кв. 48",
  bank: {
    name: 'АО "Тинькофф Банк"',
    account: "40802810700003133044",
    corrAccount: "30101810145250000974",
    bic: "044525974",
  },
};

export const SOCIAL_LINKS = {
  telegram: "https://t.me/garantmontazh",
  whatsapp: "https://wa.me/89284554559",
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
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "electrical",
    slug: "/services/electrical",
    title: "Электромонтажные работы",
    shortDescription:
      "Силовые сети, щитовое оборудование, освещение. Полный цикл от проекта до пусконаладки.",
    icon: "zap" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "structured-cabling",
    slug: "/services/structured-cabling",
    title: "Слаботочные системы",
    shortDescription:
      "Структурированные кабельные сети, интернет, телефония. Надёжная IT-инфраструктура для бизнеса.",
    icon: "network" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "smart-home",
    slug: "/services/smart-home",
    title: "Умный дом",
    shortDescription:
      "Автоматизация освещения, климата и мультимедиа. Управление всем домом с одного экрана.",
    icon: "home" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "security",
    slug: "/services/security",
    title: "Видеонаблюдение и безопасность",
    shortDescription:
      "IP-камеры, контроль доступа, охранные системы. Круглосуточный контроль объекта с телефона.",
    icon: "shield" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
];

export const STATS = [
  { value: 12, label: "лет на рынке Сочи", suffix: "" },
  { value: 280, label: "объектов сдано", suffix: "+" },
  { value: 15000, label: "м² обслуживаемая площадь", suffix: "+" },
  { value: 2, label: "года гарантия на работы", suffix: "" },
] as const;
