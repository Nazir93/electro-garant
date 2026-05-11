export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Гарант Монтаж";
/** Якорный город (офис на карте, локальные формулировки в мета). Без env — Сочи. */
export const CITY = process.env.NEXT_PUBLIC_CITY?.trim() || "Сочи";
/**
 * Зона работ в маркетинговых текстах — перечень через запятую.
 * Задаётся на сервере: NEXT_PUBLIC_SERVICE_REGIONS
 */
export const SERVICE_REGIONS =
  process.env.NEXT_PUBLIC_SERVICE_REGIONS?.trim() ||
  "Краснодарский край, Ростовская область, Москва";

/** Подзаголовок hero и похожие блоки: офис + регионы без перегруза title. */
export function getHeroGeoSubtitle(): string {
  return `Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир. Офис в ${CITY}, работаем в: ${SERVICE_REGIONS}.`;
}

/** Доп. фраза для meta description на главной и в layout. */
export function getDefaultSiteGeoDescription(): string {
  return `Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир. Офис в ${CITY}, проекты в ${SERVICE_REGIONS}. 280+ объектов. Гарантия 2 года. Допуск СРО.`;
}

type SchemaPlace = { "@type": "City" | "AdministrativeArea"; name: string };

/** Несколько зон для schema.org areaServed (организация и услуги). */
export function buildSchemaAreaServed(): SchemaPlace[] {
  const seen = new Set<string>();
  const out: SchemaPlace[] = [];
  const push = (name: string, t: "City" | "AdministrativeArea") => {
    const k = `${t}:${name}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ "@type": t, name });
  };
  push(CITY, "City");
  for (const raw of SERVICE_REGIONS.split(/[,;]+/)) {
    const name = raw.trim();
    if (!name || name === CITY) continue;
    const t = /край|область|округ|федеральный/i.test(name) ? "AdministrativeArea" : "City";
    push(name, t);
  }
  return out;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gmont.ru";

/**
 * Файл в `public/` после загрузки из админки (латиница — стабильный URL без encodeURIComponent).
 * Имя при скачивании задаётся отдельно в SiteSettings `price_list_download_name` и в ContactConfig.
 */
export const PRICE_LIST_PUBLIC_FILE = "price-list.pdf";

export const PRICE_LIST_HREF = `/${PRICE_LIST_PUBLIC_FILE}`;

/** Имя файла по умолчанию для атрибута download, если в БД не задано своё. */
export const PRICE_LIST_DOWNLOAD_NAME_DEFAULT = "Прайс ГМ 25-26(для пересылки).pdf";

/** @deprecated Используйте PRICE_LIST_DOWNLOAD_NAME_DEFAULT или contact.priceListDownloadName */
export const PRICE_LIST_FILENAME = PRICE_LIST_DOWNLOAD_NAME_DEFAULT;

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
      "Мультизональный звук для ресторанов, ритейла и офисов: проект, монтаж, Bose и JBL. Гарантия 2 года.",
    icon: "speaker" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "electrical",
    slug: "/services/electrical",
    title: "Электромонтажные работы",
    shortDescription:
      "Электромонтаж под ключ: проект, щиты, силовые линии, освещение, пусконаладка. СРО, гарантия 2 года.",
    icon: "zap" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "structured-cabling",
    slug: "/services/structured-cabling",
    title: "Слаботочные системы",
    shortDescription:
      "СКС и слаботочка для офиса: Cat 6A, серверная, ЛВС и телефония. Проект и монтаж под ключ.",
    icon: "network" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "smart-home",
    slug: "/services/smart-home",
    title: "Умный дом",
    shortDescription:
      "Умный дом под ключ: KNX, Z-Wave, свет, климат и мультимедиа. Проект и гарантия 2 года.",
    icon: "home" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "security",
    slug: "/services/security",
    title: "Видеонаблюдение и безопасность",
    shortDescription:
      "IP-видеонаблюдение и СКУД: проект, монтаж, настройка приложений. Офис и частный дом.",
    icon: "shield" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "architectural-lighting",
    slug: "/services/architectural-lighting",
    title: "Архитектурная подсветка",
    shortDescription:
      "Архитектурная и ландшафтная подсветка: LED, DMX, сценарии. Проект и монтаж под ключ.",
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
