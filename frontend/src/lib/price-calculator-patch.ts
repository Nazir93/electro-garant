/**
 * Постобработка JSON из scripts/build-price-calculator-json.mjs:
 * склеивает «пустые» заголовки PDF, добавляет строки без номера в исходнике.
 */

export type PatchItem = {
  pdfLine: number | null;
  name: string;
  unit: string;
  price: number | null;
  isHeading: boolean;
};

export type PatchSection = {
  slug: string;
  title: string;
  items: PatchItem[];
};

/** Строки без номера в pdf-price-raw.txt между 115 и 117 */
const INSERT_AFTER_PDF_LINE_115: PatchItem[] = [
  {
    pdfLine: null,
    name: "Устройство отверстия для квадратного подрозетника (гипсокартон)",
    unit: "шт",
    price: 290,
    isHeading: false,
  },
  {
    pdfLine: null,
    name: "Устройство отверстия для квадратного подрозетника (бетон)",
    unit: "шт",
    price: 960,
    isHeading: false,
  },
  {
    pdfLine: null,
    name: "Устройство отверстия для квадратного подрозетника (фанера/ОСБ)",
    unit: "шт",
    price: 290,
    isHeading: false,
  },
];

/** PDF 294–296: в тексте без цены на той же строке — дополняем из прайса */
const INSERT_KNX_SQUARE_HOLES: PatchItem[] = [
  {
    pdfLine: 294,
    name: "Устройство отверстия для квадратного подрозетника (гипсокартон)",
    unit: "шт",
    price: 290,
    isHeading: false,
  },
  {
    pdfLine: 295,
    name: "Устройство отверстия для квадратного подрозетника (бетон)",
    unit: "шт",
    price: 960,
    isHeading: false,
  },
  {
    pdfLine: 296,
    name: "Устройство отверстия для квадратного подрозетника (фанера/ОСБ)",
    unit: "шт",
    price: 290,
    isHeading: false,
  },
];

function slugify(title: string, index: number): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "section"}-${index}`;
}

export function patchPriceCalculatorSections(raw: { sections: PatchSection[] }): PatchSection[] {
  const sections = raw.sections.map((s) => ({
    ...s,
    items: s.items.map((i) => ({ ...i })),
  }));

  /** Переносим накопленные заголовки без позиций в начало следующего непустого раздела */
  const out: PatchSection[] = [];
  let pendingTitles: string[] = [];

  for (const s of sections) {
    if (s.items.length === 0) {
      pendingTitles.push(s.title);
      continue;
    }
    const items: PatchItem[] = [];
    for (const t of pendingTitles) {
      items.push({ pdfLine: null, name: t, unit: "", price: null, isHeading: true });
    }
    pendingTitles = [];
    items.push(...s.items);
    out.push({
      slug: slugify(s.title, out.length),
      title: s.title,
      items,
    });
  }

  /** Хвостовые заголовки без секции — в последний раздел */
  if (pendingTitles.length && out.length) {
    const last = out[out.length - 1];
    for (const t of pendingTitles) {
      last.items.unshift({ pdfLine: null, name: t, unit: "", price: null, isHeading: true });
    }
  }

  /** Вставки «лунки»: после позиции с pdfLine === 115 в разделе с лунками */
  for (const sec of out) {
    const idx = sec.items.findIndex((i) => i.pdfLine === 115);
    if (idx >= 0) {
      const next = sec.items[idx + 1];
      const dup =
        next &&
        INSERT_AFTER_PDF_LINE_115.some((x) => x.name.includes("квадратного") && next.name.includes("квадратного"));
      if (!dup) {
        sec.items.splice(idx + 1, 0, ...INSERT_AFTER_PDF_LINE_115.map((x) => ({ ...x })));
      }
      break;
    }
  }

  /**
   * PDF: позиция 145 — две строки без цены у «До 96», цена только у «Свыше 96» (3500).
   * Парсер склеивает в одну строку с одной ценой — разделяем.
   */
  for (const sec of out) {
    const idx = sec.items.findIndex(
      (i) =>
        i.pdfLine === 145 &&
        typeof i.name === "string" &&
        i.name.includes("До 96") &&
        i.name.includes("Свыше 96")
    );
    if (idx < 0) continue;
    const it = sec.items[idx];
    const needle = "Монтаж встраиваемого электрощита Свыше 96";
    const pos = it.name.indexOf(needle);
    if (pos <= 0) continue;
    const firstRaw = it.name.slice(0, pos).trim().replace(/\s*шт\.?\s*$/i, "").trim();
    const secondName = it.name
      .slice(pos)
      .trim()
      .replace(/\s*шт\.?\s*$/i, "")
      .trim();
    sec.items.splice(
      idx,
      1,
      {
        pdfLine: 145,
        name: firstRaw || "Монтаж встраиваемого электрощита До 96 модулей",
        unit: "шт",
        price: null,
        isHeading: false,
      },
      {
        pdfLine: null,
        name: secondName || needle,
        unit: "шт",
        price: 3500,
        isHeading: false,
      }
    );
    break;
  }

  /** PDF дублирует «квадратный подрозетник» в блоке KNX (294–296) — добавляем, если в секции ещё нет №294 */
  const knxSection =
    out.find((s) => /^\s*k\s*nx\s*$/i.test(s.title.trim())) ||
    out.find((s) => s.title.includes("Установочные изделия"));
  if (knxSection && !knxSection.items.some((i) => i.pdfLine === 294)) {
    const ins = INSERT_KNX_SQUARE_HOLES.map((x) => ({ ...x }));
    const i301 = knxSection.items.findIndex((i) => i.pdfLine === 301);
    if (i301 >= 0) knxSection.items.splice(i301, 0, ...ins);
    else knxSection.items.unshift(...ins);
  }

  /** Уникальные slug */
  const slugSeen = new Set<string>();
  out.forEach((s, idx) => {
    let slug = s.slug;
    let n = 0;
    while (slugSeen.has(slug)) {
      slug = `${s.slug}-${n++}`;
    }
    slugSeen.add(slug);
    s.slug = slug || `section-${idx}`;
  });

  return out;
}
