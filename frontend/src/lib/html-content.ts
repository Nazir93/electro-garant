/** Общая разметка для статей блога и HTML-блоков страниц (SEO-админка). */

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
