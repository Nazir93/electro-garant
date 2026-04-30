"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { Download, ChevronDown, Search, X, Trash2, Send, Zap } from "lucide-react";
import { PRICE_LIST_FILENAME, PRICE_LIST_HREF, SITE_NAME } from "@/lib/constants";
import { useContactConfig } from "@/lib/contact-config-context";
import { useModal } from "@/lib/modal-context";
import { buildEstimateLines, downloadEstimateCsv } from "@/lib/price-estimate-export";
import { PRICE_SECTIONS, AUTO_FILL_PROFILES, type PriceSection, type PriceItem, type AutoFillProfile } from "./price-data";
import { FunnelSelect } from "@/components/ui/funnel-ui";

const PROFILE_SELECT_OPTIONS = [
  { value: "", label: "Тип объекта" },
  ...AUTO_FILL_PROFILES.map((p) => ({ value: p.label, label: p.label })),
];

type Quantities = Record<number, number>;

const VAT_RATE = 0.22;

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU");
}

/* ─── Quantity control ─── */
function QuantityControl({
  qty,
  onSet,
}: {
  qty: number;
  onSet: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => onSet(Math.max(0, qty - 1))}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-110 active:scale-95 select-none"
        style={{
          backgroundColor: qty > 0 ? "rgba(201,168,76,0.15)" : "var(--bg-secondary)",
          color: qty > 0 ? "var(--accent)" : "var(--text-muted)",
          border: "1px solid var(--border)",
        }}
      >
        −
      </button>
      <input
        type="number"
        min={0}
        value={qty || ""}
        placeholder="0"
        onChange={(e) => onSet(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-10 sm:w-12 h-7 sm:h-8 text-center text-xs sm:text-sm font-heading rounded-lg bg-transparent outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ color: "var(--text)", border: "1px solid var(--border)" }}
      />
      <button
        onClick={() => onSet(qty + 1)}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-110 active:scale-95 select-none"
        style={{
          backgroundColor: "rgba(201,168,76,0.15)",
          color: "var(--accent)",
          border: "1px solid rgba(201,168,76,0.3)",
        }}
      >
        +
      </button>
    </div>
  );
}

/* ─── Item row ─── */
function ItemRow({
  item,
  qty,
  onSetQty,
  withVat,
}: {
  item: PriceItem;
  qty: number;
  onSetQty: (v: number) => void;
  withVat: boolean;
}) {
  const displayPrice = item.price
    ? withVat
      ? Math.round(item.price * (1 + VAT_RATE))
      : item.price
    : null;
  const lineTotal = displayPrice && qty > 0 ? displayPrice * qty : 0;

  return (
    <div
      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_70px_110px_140px_110px] gap-2 sm:gap-3 py-3 sm:py-3.5 border-b last:border-b-0 items-center transition-colors duration-200"
      style={{
        borderColor: "var(--border)",
        backgroundColor: qty > 0 ? "rgba(201,168,76,0.04)" : "transparent",
      }}
    >
      {/* Name */}
      <div className="min-w-0">
        <span
          className="text-xs sm:text-sm leading-tight block"
          style={{ color: qty > 0 ? "var(--text)" : "var(--text-muted)" }}
        >
          {item.name}
        </span>
        <span
          className="sm:hidden text-[10px] mt-0.5 block"
          style={{ color: "var(--text-subtle)" }}
        >
          {item.unit}
          {displayPrice ? ` · ${formatPrice(displayPrice)} ₽` : " · по договорённости"}
        </span>
      </div>

      {/* Unit (desktop) */}
      <span
        className="hidden sm:block text-[11px] text-center"
        style={{ color: "var(--text-subtle)" }}
      >
        {item.unit}
      </span>

      {/* Price (desktop) */}
      <span
        className="hidden sm:block text-sm font-heading text-right tabular-nums"
        style={{ color: displayPrice ? "var(--text)" : "var(--text-muted)" }}
      >
        {displayPrice ? `${formatPrice(displayPrice)} ₽` : "догов."}
      </span>

      {/* Quantity */}
      <div className="flex justify-end sm:justify-center">
        {item.price !== null ? (
          <QuantityControl qty={qty} onSet={onSetQty} />
        ) : (
          <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>—</span>
        )}
      </div>

      {/* Line total (desktop) */}
      <span
        className="hidden sm:block text-sm font-heading text-right tabular-nums font-semibold"
        style={{ color: lineTotal > 0 ? "var(--accent)" : "var(--text-subtle)" }}
      >
        {lineTotal > 0 ? `${formatPrice(lineTotal)} ₽` : "—"}
      </span>
    </div>
  );
}

/* ─── Section accordion ─── */
function SectionAccordion({
  section,
  index,
  isOpen,
  onToggle,
  quantities,
  onSetQty,
  withVat,
  filteredItems,
}: {
  section: PriceSection;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  quantities: Quantities;
  onSetQty: (id: number, v: number) => void;
  withVat: boolean;
  filteredItems: PriceItem[];
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionTotal = filteredItems.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    if (!item.price || qty === 0) return sum;
    const p = withVat ? Math.round(item.price * (1 + VAT_RATE)) : item.price;
    return sum + p * qty;
  }, 0);

  const selectedCount = filteredItems.filter((i) => (quantities[i.id] || 0) > 0).length;

  return (
    <div
      className="border-b transition-colors"
      style={{ borderColor: "var(--border)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 sm:py-5 px-4 sm:px-6 text-left group"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="min-w-0">
          <span
              className="font-heading text-sm sm:text-base transition-colors block truncate"
            style={{ color: isOpen ? "var(--text)" : "var(--text-muted)" }}
          >
              {section.title}
            </span>
            <span className="text-[10px] sm:text-xs block mt-0.5" style={{ color: "var(--text-subtle)" }}>
              {filteredItems.length} позиций
              {selectedCount > 0 && (
                <span style={{ color: "var(--accent)" }}> · {selectedCount} выбрано</span>
              )}
          </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {sectionTotal > 0 && (
          <span
              className="text-xs sm:text-sm font-heading tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              {formatPrice(sectionTotal)} ₽
            </span>
          )}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: isOpen ? "rgba(201,168,76,0.15)" : "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
          <ChevronDown
              size={14}
            className="transition-transform duration-300"
            style={{
                color: isOpen ? "var(--accent)" : "var(--text-muted)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
          </div>
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? `${(filteredItems.length + 1) * 60 + 80}px` : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Table header (desktop) */}
          <div
            className="hidden sm:grid grid-cols-[1fr_70px_110px_140px_110px] gap-3 pb-2.5 mb-1 border-b text-[10px] uppercase tracking-[0.15em]"
            style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          >
            <span>Наименование</span>
            <span className="text-center">Ед.</span>
            <span className="text-right">Цена</span>
            <span className="text-center">Кол-во</span>
            <span className="text-right">Сумма</span>
          </div>

          {filteredItems.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              qty={quantities[item.id] || 0}
              onSetQty={(v) => onSetQty(item.id, v)}
              withVat={withVat}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Auto-fill: расчёт количеств по профилю объекта и площади ─── */

function autoFillQuantities(profile: AutoFillProfile, area: number): Quantities {
  const q: Quantities = {};
  const totalCable = area * profile.cablePerSqm;

  for (const { id, share } of profile.cableDistribution) {
    const v = Math.round(totalCable * share);
    if (v > 0) q[id] = v;
  }

  for (const { id, perSqm } of profile.extras) {
    const v = Math.max(1, Math.round(area * perSqm));
    if (v > 0) q[id] = v;
  }

  return q;
}

function sectionsWithQuantities(quantities: Quantities): Set<string> {
  const ids = new Set(Object.keys(quantities).map(Number));
  const sections = new Set<string>();
  for (const s of PRICE_SECTIONS) {
    if (s.items.some((i) => ids.has(i.id))) sections.add(s.id);
  }
  return sections;
}

/* ─── Main page ─── */
export function PricePageContent() {
  const contact = useContactConfig();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Quantities>({});
  const [withVat, setWithVat] = useState(false);
  const [search, setSearch] = useState("");
  const { openModalWithPriceEstimate } = useModal();

  const [selectedProfile, setSelectedProfile] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);

  const handleAutoFill = useCallback(() => {
    const profile = AUTO_FILL_PROFILES.find((p) => p.label === selectedProfile);
    const area = parseFloat(areaInput);
    if (!profile || !area || area <= 0) return;
    const q = autoFillQuantities(profile, area);
    setQuantities(q);
    setOpenSections(sectionsWithQuantities(q));
    setAutoFilled(true);
    setSearch("");
  }, [selectedProfile, areaInput]);

  const setQty = useCallback((id: number, v: number) => {
    setQuantities((prev) => {
      const next = { ...prev };
      if (v <= 0) delete next[id];
      else next[id] = v;
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setOpenSections(new Set(PRICE_SECTIONS.map((s) => s.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setOpenSections(new Set());
  }, []);

  const clearEstimate = useCallback(() => {
    setQuantities({});
    setAutoFilled(false);
  }, []);

  const searchLower = search.toLowerCase().trim();

  const filteredSections = useMemo(() => {
    if (!searchLower) return PRICE_SECTIONS.map((s) => ({ section: s, items: s.items }));
    return PRICE_SECTIONS.map((s) => ({
      section: s,
      items: s.items.filter((i) => i.name.toLowerCase().includes(searchLower)),
    })).filter((s) => s.items.length > 0);
  }, [searchLower]);

  const totalItems = useMemo(
    () => Object.keys(quantities).length,
    [quantities]
  );

  const totalSum = useMemo(() => {
    let sum = 0;
    for (const section of PRICE_SECTIONS) {
      for (const item of section.items) {
        const qty = quantities[item.id] || 0;
        if (!item.price || qty === 0) continue;
        const p = withVat ? Math.round(item.price * (1 + VAT_RATE)) : item.price;
        sum += p * qty;
      }
    }
    return sum;
  }, [quantities, withVat]);

  const totalItemsCount = PRICE_SECTIONS.reduce((n, s) => n + s.items.length, 0);

  const handleDownloadCsv = useCallback(() => {
    const lines = buildEstimateLines(quantities, withVat);
    if (lines.length === 0) return;
    downloadEstimateCsv(lines, { withVat, siteName: SITE_NAME, total: totalSum });
  }, [quantities, withVat, totalSum]);

  const handleSendEstimate = useCallback(() => {
    const lines = buildEstimateLines(quantities, withVat);
    if (lines.length === 0) return;
    openModalWithPriceEstimate({
      lines,
      total: totalSum,
      withVat,
      positionCount: lines.length,
    });
  }, [quantities, withVat, totalSum, openModalWithPriceEstimate]);

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* ── Hero / калькулятор (якорь с /offer) ── */}
      <section id="price-calculator" className="scroll-mt-24 pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-14">
        <div className="container mx-auto">
          <p
            className="text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6"
            style={{ color: "var(--text-subtle)" }}
          >
            {SITE_NAME} / Прайс-лист
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight mb-4 sm:mb-6">
            КАЛЬКУЛЯТОР СМЕТЫ
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Укажите тип объекта и площадь — калькулятор автоматически рассчитает
            ориентировочные объёмы работ по нормам расхода кабеля. Можете
            скорректировать любую позицию вручную.
          </p>

          {/* ── Автозаполнение сметы ── */}
          <div
            className="mt-6 sm:mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 sm:p-6"
          >
            <p
              className="mb-4 font-heading text-base font-semibold leading-snug tracking-tight sm:text-lg"
              style={{ color: "var(--text)" }}
            >
              Быстрый расчёт по параметрам объекта
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="min-w-0 flex-1">
                <FunnelSelect
                  variant="boxed"
                  className="[&_button]:text-sm"
                  options={PROFILE_SELECT_OPTIONS}
                  placeholder="Тип объекта"
                  value={selectedProfile}
                  onChange={(v) => {
                    setSelectedProfile(v);
                    setAutoFilled(false);
                  }}
                />
              </div>

              <div className="relative w-full sm:w-44">
                <input
                  type="text"
                  inputMode="numeric"
                  value={areaInput}
                  onChange={(e) => { setAreaInput(e.target.value.replace(/[^\d.,]/g, "")); setAutoFilled(false); }}
                  placeholder="Площадь, м²"
                  className="funnel-text-input w-full px-4 py-3 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-1"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    backgroundColor: "var(--bg)",
                    ["--tw-ring-color" as string]: "var(--accent)",
                  }}
                />
              </div>

              <button
                onClick={handleAutoFill}
                disabled={!selectedProfile || !areaInput || parseFloat(areaInput) <= 0}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-heading transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#000",
                }}
              >
                <Zap size={16} />
                Рассчитать
              </button>
            </div>

            {autoFilled && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Смета заполнена: <strong style={{ color: "var(--accent)" }}>{Object.keys(quantities).length}</strong> позиций
                  {" · "}
                  Расход кабеля: <strong style={{ color: "var(--accent)" }}>
                    {formatPrice(Math.round(parseFloat(areaInput) * (AUTO_FILL_PROFILES.find((p) => p.label === selectedProfile)?.cablePerSqm || 0)))} м
                  </strong>
                  {" · "}
                  Площадь: <strong style={{ color: "var(--accent)" }}>{areaInput} м²</strong>
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>
                  Вы можете скорректировать количество в любой строке
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8">
            {[
              { label: "Разделов", value: PRICE_SECTIONS.length },
              { label: "Видов работ", value: totalItemsCount },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <span className="font-heading text-2xl sm:text-3xl" style={{ color: "var(--accent)" }}>
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Toolbar: search + VAT toggle + expand/collapse ── */}
      <section
        className="sticky z-30 border-y backdrop-blur-xl top-14 sm:top-16"
        style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg) 85%, transparent)" }}
      >
        <div className="container mx-auto py-3 sm:py-4">
          <h2
            className="font-heading text-base font-semibold tracking-tight sm:text-lg mb-3 sm:mb-3.5"
            style={{ color: "var(--text)" }}
          >
            Рассчитать смету вручную
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию работ..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-base sm:text-sm bg-transparent outline-none transition-all duration-200 focus:ring-1"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  ["--tw-ring-color" as string]: "var(--accent)",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* VAT toggle */}
              <button
                onClick={() => setWithVat(!withVat)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: withVat ? "rgba(201,168,76,0.15)" : "var(--bg-secondary)",
                  border: `1px solid ${withVat ? "rgba(201,168,76,0.5)" : "var(--border)"}`,
                  color: withVat ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <div
                  className="w-8 h-[18px] rounded-full relative transition-colors duration-300"
                  style={{ backgroundColor: withVat ? "var(--accent)" : "var(--border)" }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all duration-300"
                    style={{
                      backgroundColor: withVat ? "#fff" : "var(--text-muted)",
                      left: withVat ? "16px" : "2px",
                    }}
                  />
                </div>
                НДС 22%
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  onClick={expandAll}
                  className="px-3 py-2 rounded-xl text-xs transition-colors min-h-[44px] sm:min-h-0"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  Развернуть
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-2 rounded-xl text-xs transition-colors min-h-[44px] sm:min-h-0"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  Свернуть
                </button>
              </div>
            </div>
          </div>

          <div className="flex sm:hidden items-stretch gap-2 mt-2">
            <button
              type="button"
              onClick={expandAll}
              className="flex-1 py-3 rounded-xl text-xs font-medium transition-colors min-h-[44px]"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              Развернуть всё
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="flex-1 py-3 rounded-xl text-xs font-medium transition-colors min-h-[44px]"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              Свернуть всё
            </button>
          </div>

          {/* Search results count */}
          {search && (
            <p className="text-[11px] mt-2" style={{ color: "var(--text-subtle)" }}>
              Найдено: {filteredSections.reduce((n, s) => n + s.items.length, 0)} позиций
              в {filteredSections.length} разделах
            </p>
          )}
        </div>
      </section>

      {/* ── Price table ── */}
      <section className="pb-32 sm:pb-36">
        <div className="container mx-auto">
          <div
            className="rounded-2xl overflow-hidden border mt-0"
            style={{ borderColor: "var(--border)" }}
          >
            {filteredSections.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Ничего не найдено по запросу «{search}»
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-3 text-xs underline"
                  style={{ color: "var(--accent)" }}
                >
                  Сбросить поиск
                </button>
              </div>
            ) : (
              filteredSections.map(({ section, items }, i) => (
                <SectionAccordion
                  key={section.id}
                  section={section}
                  index={i}
                  isOpen={openSections.has(section.id)}
                  onToggle={() => toggle(section.id)}
                  quantities={quantities}
                  onSetQty={setQty}
                  withVat={withVat}
                  filteredItems={items}
                />
              ))
            )}
          </div>

          <p
            className="mt-6 text-[11px] sm:text-xs leading-relaxed max-w-2xl"
            style={{ color: "var(--text-subtle)" }}
          >
            * Указаны ориентировочные цены без НДС. Окончательная стоимость определяется
            после осмотра объекта и составления индивидуальной сметы.
          </p>
        </div>
      </section>

      {/* ── Sticky bottom bar (estimate summary) ── */}
      <div
        className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-all duration-500"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "color-mix(in srgb, var(--bg) 92%, transparent)",
          transform: totalItems > 0 ? "translateY(0)" : "translateY(100%)",
          opacity: totalItems > 0 ? 1 : 0,
          pointerEvents: totalItems > 0 ? "auto" : "none",
        }}
      >
        <div className="container mx-auto py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Итого{withVat ? " (с НДС)" : " (без НДС)"}
                </p>
                <p className="font-heading text-xl sm:text-2xl md:text-3xl tabular-nums" style={{ color: "var(--accent)" }}>
                  {formatPrice(totalSum)} ₽
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Позиций
                </p>
                <p className="font-heading text-lg tabular-nums">{totalItems}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={clearEstimate}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                }}
                title="Очистить смету"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-heading text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  backgroundColor: "var(--bg-secondary)",
                }}
                title="Скачать смету в Excel (CSV)"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Скачать CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
              <button
                type="button"
                onClick={handleSendEstimate}
                className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-heading text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#000",
                }}
              >
                <Send size={14} />
                <span className="hidden sm:inline">Отправить смету</span>
                <span className="sm:hidden">Отправить</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Download + CTA ── */}
      <section
        className="border-t py-12 sm:py-16 md:py-20"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl mb-3">
                Скачайте полный прайс-лист
              </h2>
              <p
                className="text-xs sm:text-sm max-w-md"
                style={{ color: "var(--text-muted)" }}
              >
                PDF-документ с актуальными ценами на все виды работ,
                материалы и оборудование
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
              <a
                href={PRICE_LIST_HREF}
                download={PRICE_LIST_FILENAME}
                className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-heading text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] min-h-[48px]"
                style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
              >
                <Download size={16} />
                Скачать PDF
              </a>
            </div>
          </div>

          <div
            className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              Нужна индивидуальная смета?
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <a
                href={`tel:${contact.phoneRaw}`}
                className="font-heading text-lg sm:text-xl transition-colors hover:opacity-80"
                style={{ color: "var(--text)" }}
              >
                {contact.phone}
              </a>
              <a
                href={`tel:${contact.phone2Raw}`}
                className="font-heading text-lg sm:text-xl transition-colors hover:opacity-80"
                style={{ color: "var(--text)" }}
              >
                {contact.phone2}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
