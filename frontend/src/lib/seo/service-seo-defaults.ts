import { CITY, SERVICE_REGIONS, SITE_NAME } from "@/lib/constants";
import type { ServicePageSlug } from "@/lib/service-landing-defaults";

const C = CITY;
const S = SITE_NAME;
/** В конце description: офис + зона работ (без дублирования в title). */
const GEO_TAIL = ` Офис в ${C}, проекты в ${SERVICE_REGIONS}.`;

/** Чек-лист кластера (meta keywords); поисковики учитывают слабо — удобно для редакции. */
export interface ServiceSeoBundle {
  title: string;
  description: string;
  keywords: string[];
  /** Рекомендуемый H1 при заполнении PageMeta в админке (один на страницу). */
  h1: string;
  /** Тезисы для редакторов: куда усилить H2/подзаголовки лендинга без переспама. */
  landingTheses: string[];
}

export interface ServicesIndexSeoBundle {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  landingTheses: string[];
}

/**
 * Семантика: коммерческий интент + гео (вариант A — один город в мета).
 * Пересечения между URL разведены: у каждой страницы свой главный кластер.
 */
export function getServicesIndexSeo(): ServicesIndexSeoBundle {
  return {
    title: `Электромонтаж и инженерные системы — ${C} и регионы | ${S}`,
    description: `Проектирование и монтаж электрики, умного дома, СКС, видеонаблюдения и акустики для бизнеса и частных объектов.${GEO_TAIL} СРО, гарантия 5 лет.`,
    keywords: [
      `электромонтаж ${C}`,
      `инженерные системы ${C}`,
      "электромонтаж под ключ",
      "умный дом монтаж",
      "слаботочные системы СКС",
      "видеонаблюдение установка",
      "коммерческая акустика",
      S,
    ],
    h1: `Электромонтаж и инженерные системы — офис в ${C}`,
    landingTheses: [
      "Главная — обзор направлений без дублирования длинных ключей с лендингов услуг.",
      "Коротко: под ключ, проект, СРО, гарантия; гео — база в городе из настроек + регионы в тексте.",
      "Внутренние ссылки: каждая карточка ведёт на свой /services/{slug}.",
    ],
  };
}

function bundleForSlug(slug: ServicePageSlug): ServiceSeoBundle {
  switch (slug) {
    case "electrical":
      return {
        title: `Электромонтаж под ключ в ${C}: проект, щиты, силовые сети | ${S}`,
        description: `Электромонтаж квартир, ресторанов и офисов в ${C}: проектирование, щиты ABB и Schneider, силовые линии, освещение, пусконаладка. Допуск СРО, гарантия 5 лет.${GEO_TAIL}`,
        keywords: [
          `электромонтаж ${C}`,
          `электромонтажные работы ${C}`,
          `электрик ${C}`,
          "электромонтаж под ключ",
          "проект электроснабжения",
          "монтаж электропроводки коммерческий объект",
          S,
        ],
        h1: `Электромонтажные работы в ${C} под ключ`,
        landingTheses: [
          "Главный кластер: электромонтаж + гео; усилить — ресторан/офис/квартира, щит, ПУЭ.",
          "Не смешивать с СКС и умным домом — отдельные страницы под эти запросы.",
        ],
      };
    case "acoustics":
      return {
        title: `Коммерческая акустика и озвучка ресторанов в ${C} | ${S}`,
        description: `Проектирование и монтаж мультизонального звука для ресторанов, кафе и ритейла в ${C}. Фон, зоны, Bose и JBL. Гарантия 5 лет.${GEO_TAIL}`,
        keywords: [
          `коммерческая акустика ${C}`,
          `озвучка ресторана ${C}`,
          "мультизональный звук",
          "фоновая музыка для бизнеса",
          "архитектурная акустика",
          S,
        ],
        h1: `Коммерческая акустика для бизнеса в ${C}`,
        landingTheses: [
          "Кластер: звук для HoReCa и ритейла, не «домашняя акустика».",
          "Уточнять зоны, DSP, бренды — в подзаголовках и FAQ.",
        ],
      };
    case "structured-cabling":
      return {
        title: `СКС и слаботочные системы для офиса в ${C} | ${S}`,
        description: `Монтаж структурированных кабельных сетей и слаботочки в ${C}: серверная, Cat 6A, телефония, ЛВС. Проект, сдача и гарантия 5 лет.${GEO_TAIL}`,
        keywords: [
          `СКС ${C}`,
          `слаботочные системы ${C}`,
          "монтаж СКС офис",
          "структурированные кабельные сети",
          "проектирование ЛВС",
          S,
        ],
        h1: `Слаботочные системы и СКС в ${C}`,
        landingTheses: [
          "Кластер: СКС/ЛВС/серверная — не путать с силовым электромонтажом.",
          "Усилить запросы: офис, Cat 6A, монтаж патч-панели.",
        ],
      };
    case "smart-home":
      return {
        title: `Умный дом под ключ в ${C}: KNX, Z-Wave, сценарии | ${S}`,
        description: `Монтаж умного дома в ${C}: автоматизация света, климата и мультимедиа, KNX и Z-Wave, сценарии и интеграции. Проект, пусконаладка, гарантия 5 лет.${GEO_TAIL}`,
        keywords: [
          `умный дом ${C}`,
          `монтаж умного дома ${C}`,
          "автоматизация освещения",
          "KNX монтаж",
          "Z-Wave",
          S,
        ],
        h1: `Умный дом в ${C} под ключ`,
        landingTheses: [
          "Кластер: автоматизация жилья и апартаментов премиум, не промышленная автоматика.",
          "Согласовать термины с лендингом (KNX/Z-Wave) в H2.",
        ],
      };
    case "security":
      return {
        title: `Видеонаблюдение и СКУД в ${C}: установка под ключ | ${S}`,
        description: `Монтаж IP-видеонаблюдения и контроля доступа в ${C}: камеры, архив, СКУД для офиса и дома. Проект, монтаж, настройка приложений. Гарантия 5 лет.${GEO_TAIL}`,
        keywords: [
          `видеонаблюдение ${C}`,
          `установка камер ${C}`,
          "IP видеонаблюдение монтаж",
          "СКУД установка",
          "охранные системы объект",
          S,
        ],
        h1: `Видеонаблюдение и безопасность в ${C}`,
        landingTheses: [
          "Кластер: коммерческое и частное видео + доступ; не дублировать «электромонтаж».",
          "IP, облако/архив, интеграция со слаботочкой — отдельные блоки.",
        ],
      };
    case "architectural-lighting":
      return {
        title: `Архитектурная подсветка фасада и ландшафта в ${C} | ${S}`,
        description: `Проект и монтаж архитектурной и ландшафтной подсветки в ${C}: LED, DMX, сценарии, управление со смартфона. Обслуживание и гарантия.${GEO_TAIL}`,
        keywords: [
          `архитектурная подсветка ${C}`,
          `подсветка фасада ${C}`,
          "ландшафтная подсветка LED",
          "DMX управление светом",
          "фасадная иллюминация",
          S,
        ],
        h1: `Архитектурная подсветка в ${C}`,
        landingTheses: [
          "Кластер: фасад/терраса/участок; не пересекать с общим электромонтажом по формулировкам title.",
          "LED/DMX/сценарии — в подзаголовках и кейсах.",
        ],
      };
  }
}

/** Метаданные для generateMetadata (без h1/landingTheses). */
export function getDefaultMetaForServiceSlug(slug: ServicePageSlug): {
  title: string;
  description: string;
  keywords: string[];
} {
  const b = bundleForSlug(slug);
  return { title: b.title, description: b.description, keywords: b.keywords };
}

export function getServiceSeoBundle(slug: ServicePageSlug): ServiceSeoBundle {
  return bundleForSlug(slug);
}

/** Значения для записи PageMeta (путь → поля). */
export function getServicePageMetaSeeds(): Array<{
  path: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
}> {
  const index = getServicesIndexSeo();
  const rows: Array<{ path: string; title: string; description: string; keywords: string; h1: string }> = [
    {
      path: "/services",
      title: index.title,
      description: index.description,
      keywords: index.keywords.join(", "),
      h1: index.h1,
    },
  ];
  const slugs: ServicePageSlug[] = [
    "electrical",
    "acoustics",
    "structured-cabling",
    "smart-home",
    "security",
    "architectural-lighting",
  ];
  for (const slug of slugs) {
    const m = bundleForSlug(slug);
    rows.push({
      path: `/services/${slug}`,
      title: m.title,
      description: m.description,
      keywords: m.keywords.join(", "),
      h1: m.h1,
    });
  }
  return rows;
}
