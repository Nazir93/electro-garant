import { SITE_NAME, CITY } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { getPageMeta } from "@/lib/get-page-meta";
import { BlogPageContent } from "./content";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getPageMeta({
    title: `Блог — статьи и новости | ${SITE_NAME}`,
    description: `Полезные статьи об электромонтаже, умном доме, видеонаблюдении и акустике в ${CITY}. Советы экспертов ${SITE_NAME}.`,
    path: "/blog",
    keywords: [`блог ${CITY}`, "электромонтаж статьи", "умный дом советы", SITE_NAME],
  });
}

const FALLBACK_POSTS = [
  { id: "1", title: "Как выбрать подрядчика для электромонтажа", excerpt: "Разбираем критерии оценки: допуск СРО, портфолио, гарантия, проектная документация. На что обратить внимание при выборе.", category: "Электромонтаж", date: "12.02.2026" },
  { id: "2", title: "Умный дом: KNX vs Z-Wave — что выбрать", excerpt: "Сравниваем два популярных протокола автоматизации. Плюсы, минусы, стоимость и сценарии использования для квартир и коммерции.", category: "Умный дом", date: "05.02.2026" },
  { id: "3", title: "5 ошибок при монтаже видеонаблюдения", excerpt: "Почему камеры не записывают ночью, архив заканчивается за 3 дня, и как избежать типичных проблем при установке системы безопасности.", category: "Безопасность", date: "28.01.2026" },
  { id: "4", title: "Акустика для ресторана: зонирование звука", excerpt: "Как сделать так, чтобы музыка создавала атмосферу, а не мешала гостям общаться. Мультизональные системы и архитектурная акустика.", category: "Акустика", date: "20.01.2026" },
  { id: "5", title: "Электрощит: от расчёта до сборки", excerpt: "Подробный гайд по проектированию и сборке электрощита для квартиры. Автоматы, УЗО, реле напряжения — что действительно нужно.", category: "Электромонтаж", date: "14.01.2026" },
  { id: "6", title: "СКС для офиса: инфраструктура на годы вперёд", excerpt: "Почему Cat 6A, а не Cat 5e. Как спроектировать серверную и обеспечить бесшовный Wi-Fi на весь офис.", category: "Слаботочка", date: "08.01.2026" },
  { id: "7", title: "Как мы автоматизировали ресторан на 400 м²", excerpt: "Кейс: мультизональный звук, диммируемое освещение, система вызова персонала и управление с iPad. Полный цикл за 14 дней.", category: "Кейсы", date: "25.12.2025" },
  { id: "8", title: "Освещение в квартире: сценарии и управление", excerpt: "Общий свет, рабочий, акцентный, ночной — разбираем, как спроектировать грамотное освещение и управлять им с телефона.", category: "Умный дом", date: "18.12.2025" },
  { id: "9", title: "Видеоаналитика: не просто запись, а инструмент", excerpt: "Подсчёт посетителей, детекция очередей, распознавание номеров — как современные камеры помогают бизнесу зарабатывать больше.", category: "Безопасность", date: "10.12.2025" },
];

async function getPosts() {
  try {
    const dbPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbPosts.length > 0) {
      return dbPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        category: p.category,
        date: p.createdAt.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }),
      }));
    }
  } catch {
    // DB not available
  }
  return FALLBACK_POSTS;
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogPageContent posts={posts} />;
}
