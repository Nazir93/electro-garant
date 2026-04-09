import type { ServiceType } from "@prisma/client";
import { prisma } from "@/lib/db";

/** Совпадает с каталогом на сайте (constants + URL /services/{slug}). */
const DEFAULT_SERVICES: Array<{
  slug: string;
  serviceType: ServiceType;
  title: string;
  shortDescription: string;
  icon: string;
}> = [
  {
    slug: "electrical",
    serviceType: "ELECTRICAL",
    title: "Электромонтажные работы",
    shortDescription:
      "Электромонтаж под ключ: проект, щиты, силовые линии, освещение, пусконаладка. СРО, гарантия 5 лет.",
    icon: "zap",
  },
  {
    slug: "acoustics",
    serviceType: "ACOUSTICS",
    title: "Коммерческая акустика",
    shortDescription:
      "Мультизональный звук для ресторанов, ритейла и офисов: проект, монтаж, Bose и JBL. Гарантия 5 лет.",
    icon: "speaker",
  },
  {
    slug: "structured-cabling",
    serviceType: "STRUCTURED_CABLING",
    title: "Слаботочные системы",
    shortDescription:
      "СКС и слаботочка для офиса: Cat 6A, серверная, ЛВС и телефония. Проект и монтаж под ключ.",
    icon: "network",
  },
  {
    slug: "smart-home",
    serviceType: "SMART_HOME",
    title: "Умный дом",
    shortDescription:
      "Умный дом под ключ: KNX, Z-Wave, свет, климат и мультимедиа. Проект и гарантия 5 лет.",
    icon: "home",
  },
  {
    slug: "security",
    serviceType: "SECURITY",
    title: "Видеонаблюдение и безопасность",
    shortDescription:
      "IP-видеонаблюдение и СКУД: проект, монтаж, настройка приложений. Офис и частный дом.",
    icon: "shield",
  },
  {
    slug: "architectural-lighting",
    serviceType: "ARCHITECTURAL_LIGHTING",
    title: "Архитектурная подсветка",
    shortDescription:
      "Архитектурная и ландшафтная подсветка: LED, DMX, сценарии. Проект и монтаж под ключ.",
    icon: "sun",
  },
];

/**
 * Если в таблице меньше 6 услуг — дополняет недостающие slug из шаблона (без перезаписи существующих).
 * Дешёвая проверка: один `count`, затем при необходимости создание.
 */
export async function ensureDefaultServicesIfNeeded(): Promise<void> {
  const n = await prisma.service.count();
  if (n >= DEFAULT_SERVICES.length) return;
  await ensureDefaultServices();
}

/**
 * Создаёт в БД записи услуг по шаблону сайта, если такого slug ещё нет.
 * Уже существующие строки не перезаписывает.
 */
export async function ensureDefaultServices(): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;

  for (let order = 0; order < DEFAULT_SERVICES.length; order++) {
    const row = DEFAULT_SERVICES[order];
    const exists = await prisma.service.findUnique({ where: { slug: row.slug } });
    if (exists) {
      skipped += 1;
      continue;
    }

    try {
      await prisma.service.create({
        data: {
          slug: row.slug,
          title: row.title,
          shortDescription: row.shortDescription,
          serviceType: row.serviceType,
          icon: row.icon,
          coverImage: null,
          videoUrl: null,
          bannerImageDesktop: null,
          bannerImageMobile: null,
          published: true,
          order,
        },
      });
      created += 1;
    } catch (e: unknown) {
      const code = e && typeof e === "object" && "code" in e ? (e as { code?: string }).code : "";
      if (code === "P2002") skipped += 1;
      else throw e;
    }
  }

  return { created, skipped };
}
