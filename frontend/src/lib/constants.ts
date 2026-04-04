export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Гарант Монтаж";
export const CITY = process.env.NEXT_PUBLIC_CITY || "Сочи";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gmont.ru";

export const PHONE = "8 (928) 455-45-59";
export const PHONE_RAW = "89284554559";
export const PHONE2 = "8 (900) 233-66-39";
export const PHONE2_RAW = "89002336639";
export const EMAIL = "garantmontaj@gmail.com";
/** Адрес офиса (для контактов и карты) */
export const ADDRESS = "г. Сочи, ул. Авиационная, 15";
export const WORKING_HOURS = "Пн–Пт 9:00–17:00";

/**
 * Координаты офиса (WGS84): долгота, широта.
 * Привязаны к адресу ADDRESS (ул. Авиационная, 15, Сочи).
 * При смене офиса обновите координаты или задайте NEXT_PUBLIC_OFFICE_GEO_LON / NEXT_PUBLIC_OFFICE_GEO_LAT.
 */
export const OFFICE_GEO_LON = Number(
  process.env.NEXT_PUBLIC_OFFICE_GEO_LON?.trim() || "39.933169"
);
export const OFFICE_GEO_LAT = Number(
  process.env.NEXT_PUBLIC_OFFICE_GEO_LAT?.trim() || "43.430127"
);

/** Встроенный виджет: центр + красная метка pm2rdm на здании */
export function getYandexOfficeMapEmbedUrl(): string {
  const lon = OFFICE_GEO_LON;
  const lat = OFFICE_GEO_LAT;
  const ll = `${lon}%2C${lat}`;
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=17&l=map&pt=${lon},${lat},pm2rdm`;
}

/** Полноэкранные Яндекс.Карты — та же метка, что и во встроенном виджете */
export function getYandexOfficeMapLinkUrl(): string {
  const lon = OFFICE_GEO_LON;
  const lat = OFFICE_GEO_LAT;
  return `https://yandex.ru/maps/?pt=${lon}%2C${lat}&z=17&l=map`;
}

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
  telegram: "https://t.me/Gmontaj",
  /** Мессенджер Max — ссылка на чат или профиль (задать в .env) */
  max:
    process.env.NEXT_PUBLIC_MAX_CHAT_URL?.trim() ||
    "https://max.ru/u/f9LHodD0cOICVt6F_SbXekYin0iKseqgg53Vo-E4sCJ1sXjkB0Bs18LxWUg",
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
  {
    id: "architectural-lighting",
    slug: "/services/architectural-lighting",
    title: "Архитектурная подсветка",
    shortDescription:
      "Проект и монтаж фасадной и ландшафтной подсветки. LED, сценарии, управление со смартфона.",
    icon: "sun" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
];

/** Нижняя панель статистики (fixed-stats-bar): число + подпись, при наведении — detail */
export const STATS = [
  {
    value: 13,
    label: "лет на рынке",
    suffix: "",
    detail:
      "Мы работаем с FG Group, Роза Хутор, Горки Город, MR. Food и др.",
  },
  {
    value: 250,
    label: "объектов сдано",
    suffix: "+",
    detail:
      "26 баров и ресторанов, 2 гостиницы, 1 завод, 200+ частных заказов",
  },
  {
    value: 145000,
    label: "м кабеля протянуто в 2025 году",
    suffix: "+",
    detail: "",
  },
  {
    value: 3,
    label: "Работаем в 3-х регионах страны",
    suffix: "",
    detail: "Краснодарский край, Ростовская обл., Москва",
  },
] as const;
