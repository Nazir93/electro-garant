/**
 * Источники заявок (поле Lead.source при POST /api/leads).
 * Используется в админке: фильтры, подписи, подменю.
 */
export const LEAD_SOURCE_OPTIONS: { value: string; label: string; hint?: string }[] = [
  { value: "price-smeta", label: "Смета с калькулятора прайса", hint: "Страница /price, отправка набранной сметы" },
  { value: "project-form", label: "Описание проекта", hint: "Модалка: есть проект" },
  { value: "inspection-request", label: "Выезд инженера", hint: "Модалка: осмотр объекта" },
  { value: "calculator", label: "Ориентировочный расчёт", hint: "Модалка: калькулятор стоимости" },
  { value: "offer-page", label: "Оффер: обратная связь", hint: "/offer/form" },
  { value: "offer-pizza", label: "Оффер: пицца / комментарий", hint: "Бонус после таймера" },
  { value: "partner-partner", label: "Партнёры: подряд", hint: "/partners/partner" },
  { value: "partner-supplier", label: "Партнёры: поставщик", hint: "/partners/supplier" },
];

/** Значение фильтра «нет источника в БД» (null или literal unknown) */
export const LEAD_SOURCE_EMPTY = "__none__";

export function getLeadSourceLabel(source: string | null | undefined): string {
  if (source == null || source === "") {
    return "Не указан";
  }
  if (source === "unknown") {
    return "Не указан (unknown)";
  }
  const found = LEAD_SOURCE_OPTIONS.find((o) => o.value === source);
  return found?.label ?? source;
}
