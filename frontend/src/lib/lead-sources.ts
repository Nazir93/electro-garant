/**
 * Источники заявок (поле Lead.source при POST /api/leads).
 * Используется в админке: фильтры, подписи, подменю.
 */
export const LEAD_SOURCE_OPTIONS: { value: string; label: string; hint?: string }[] = [
  { value: "price-smeta", label: "Смета с калькулятора прайса", hint: "Страница /price, отправка набранной сметы" },
  { value: "calculator", label: "Ориентировочный расчёт", hint: "Модалка: калькулятор стоимости" },
  { value: "offer-page", label: "Оффер: обратная связь", hint: "/offer/form" },
  { value: "partner-partner", label: "Партнёры: подряд", hint: "/partners/partner" },
  { value: "partner-supplier", label: "Партнёры: поставщик", hint: "/partners/supplier" },
];

const LEGACY_SOURCE_LABELS: Record<string, string> = {
  "inspection-request": "Выезд инженера (старое)",
  "project-form": "Описание проекта (старое)",
  "offer-pizza": "Оффер: комментарий после таймера (архив)",
  "calculator-pizza": "Расчёт: комментарий после таймера (архив)",
};

export function getLeadSourceLabel(source: string | null | undefined): string {
  if (source == null || source === "") {
    return "Не указан";
  }
  if (source === "unknown") {
    return "Не указан (unknown)";
  }
  const found = LEAD_SOURCE_OPTIONS.find((o) => o.value === source);
  if (found) return found.label;
  return LEGACY_SOURCE_LABELS[source] ?? source;
}
