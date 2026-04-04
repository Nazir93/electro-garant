import type { ServiceItem } from "@/lib/get-services";

/**
 * Запасные изображения для карточек услуг (главная hero, fallback), если в админке не загружено фото/видео.
 * Ключ — полный путь slug из {@link ServiceItem.slug}.
 */
const FALLBACK_SIDE_IMAGE_BY_SLUG: Record<string, string> = {
  "/services/acoustics": "/images/hero/hero-01.png",
  "/services/smart-home": "/images/hero/hero-02.png",
  "/services/electrical": "/images/hero/hero-03.png",
  "/services/structured-cabling": "/images/hero/hero-04.png",
  "/services/security": "/images/hero/hero-05.png",
  "/services/architectural-lighting": "/images/hero/hero-02.png",
};

function normalizeSlugPath(slug: string): string {
  return slug.split("?")[0]?.replace(/\/$/, "") ?? slug;
}

/**
 * Медиа для карточки услуги: сначала данные из админки (обложка / видео), иначе картинка из макета.
 */
export function resolveServiceCardMedia(s: ServiceItem): {
  coverImage: string | null;
  videoUrl: string | null;
} {
  if (s.coverImage?.trim()) {
    return { coverImage: s.coverImage.trim(), videoUrl: null };
  }
  if (s.videoUrl?.trim()) {
    return { coverImage: null, videoUrl: s.videoUrl.trim() };
  }
  const path = normalizeSlugPath(s.slug);
  const fallback = FALLBACK_SIDE_IMAGE_BY_SLUG[path];
  if (fallback) return { coverImage: fallback, videoUrl: null };
  return { coverImage: null, videoUrl: null };
}

/** Для LCP: есть ли что показать в карточке (в т.ч. fallback-картинка). */
export function serviceCardHasVisualMedia(s: ServiceItem): boolean {
  const m = resolveServiceCardMedia(s);
  return Boolean(m.coverImage || m.videoUrl);
}
