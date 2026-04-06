/** Общая разметка для статей блога и HTML-блоков страниц (SEO-админка). */

/** Классы для вводного текста на листингах (портфолио, блог): переносы, длина строки ~65ch, ru-типографика. */
export const PAGE_INTRO_PROSE_CLASS =
  "w-full max-w-[min(100%,65ch)] text-sm sm:text-base md:text-[1.0625rem] leading-[1.65] sm:leading-relaxed text-pretty break-words hyphens-auto [overflow-wrap:anywhere] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-[var(--accent)]/60 [&_strong]:font-semibold [&_strong]:text-[var(--text)] [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg";

export function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<script[\s>][\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s>][\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, "")
    .replace(/javascript\s*:/gi, "blocked:")
    .replace(/data\s*:\s*text\/html/gi, "blocked:")
    .replace(/<\/?(iframe|object|embed|form|input|textarea|button|select|meta|link|base|applet)[\s>][^>]*>/gi, "");
}

/** Текст статьи или блока: HTML как есть (после sanitize) или абзацы через пустую строку. */
export function formatArticleBody(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (t.startsWith("<")) return sanitizeArticleHtml(t);
  return t
    .split("\n\n")
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}
