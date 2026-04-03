import { PRICE_SECTIONS } from "@/app/price/price-data";

const VAT_RATE = 0.22;

export type EstimateLine = {
  id: number;
  sectionTitle: string;
  name: string;
  unit: string;
  qty: number;
  pricePerUnit: number;
  lineTotal: number;
};

export type PriceEstimatePayload = {
  lines: EstimateLine[];
  total: number;
  withVat: boolean;
  positionCount: number;
};

export function buildEstimateLines(
  quantities: Record<number, number>,
  withVat: boolean
): EstimateLine[] {
  const lines: EstimateLine[] = [];
  for (const section of PRICE_SECTIONS) {
    for (const item of section.items) {
      const qty = quantities[item.id] || 0;
      if (qty <= 0 || item.price == null) continue;
      const pricePerUnit = withVat ? Math.round(item.price * (1 + VAT_RATE)) : item.price;
      lines.push({
        id: item.id,
        sectionTitle: section.title,
        name: item.name,
        unit: item.unit,
        qty,
        pricePerUnit,
        lineTotal: pricePerUnit * qty,
      });
    }
  }
  return lines;
}

function csvCell(v: string | number): string {
  const s = String(v);
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** CSV с разделителем `;` и BOM — корректно открывается в Excel */
export function downloadEstimateCsv(
  lines: EstimateLine[],
  opts: { withVat: boolean; siteName: string; total: number }
): void {
  const sep = ";";
  const header = ["Наименование", "Раздел", "Ед.", "Кол-во", "Цена", "Сумма"].map(csvCell).join(sep);
  const meta = [
    `${csvCell("Смета")}${sep}${csvCell(opts.siteName)}`,
    `${csvCell("НДС")}${sep}${csvCell(opts.withVat ? "22%" : "без НДС")}`,
    "",
    header,
  ];
  const body = lines.map((l) =>
    [l.name, l.sectionTitle, l.unit, l.qty, l.pricePerUnit, l.lineTotal].map(csvCell).join(sep)
  );
  const footer = ["", `${csvCell("Итого")}${sep}${sep}${sep}${sep}${sep}${csvCell(opts.total)}`];
  const text = `\ufeff${[...meta, ...body, ...footer].join("\r\n")}`;
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  const safeName = opts.siteName.replace(/[^\wа-яА-ЯёЁ\-]+/gi, "-").slice(0, 40);
  a.href = URL.createObjectURL(blob);
  a.download = `smeta-${safeName}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
