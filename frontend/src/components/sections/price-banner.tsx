"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, Download, Building2, LayoutGrid, Plug2, MapPinned } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { PRICE_LIST_FILENAME, PRICE_LIST_HREF } from "@/lib/constants";

/** Нижняя бегущая строка — не дублирует цифры из FixedStatsBar и не список услуг как в шапке */
const PRICE_TICKER_ITEMS = [
  "Смета до старта работ",
  "Оплата по этапам",
  "Допуск СРО",
  "Приёмка по чек-листу",
  "Договор и закрывающие",
  "Собственные бригады",
] as const;

const ADVANTAGES = [
  {
    icon: Building2,
    label: "На рынке",
    value: "13",
    unit: "лет",
    desc: "Мы работаем с FG Group, Роза Хутор, Горки Город, MR. Food и др.",
  },
  {
    icon: LayoutGrid,
    label: "Объектов сдано",
    value: "250",
    unit: "+",
    desc: "26 баров и ресторанов, 2 гостиницы, 1 завод, 200+ частных заказов",
  },
  {
    icon: Plug2,
    label: "Кабеля протянуто",
    value: "145 000",
    unit: "+ м",
    desc: "в 2025 году",
  },
  {
    icon: MapPinned,
    label: "Регионы работы",
    value: "3",
    unit: "региона",
    desc: "Работаем в 3-х регионах страны: Краснодарский край, Ростовская обл., Москва",
  },
];

export function PriceBannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { isDark } = useTheme();

  const accentRGB = "201,168,76";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="price-banner"
      className="relative border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
    >
      <div className="container mx-auto px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-14 sm:py-16 md:py-20 lg:py-24">
        {/* Заголовок — без повтора цифр из нижней панели; акцент на инструментах */}
        <div
          className="mb-8 transition-all duration-700 sm:mb-10 md:mb-12 md:grid md:grid-cols-12 md:items-end md:gap-x-10 lg:gap-x-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div className="mb-5 md:col-span-7 md:mb-0">
            <div className="mb-4 flex items-center gap-3 md:mb-5">
              <div
                className="h-2 w-2 shrink-0 rounded-full animate-pulse"
                style={{ backgroundColor: `rgba(${accentRGB},0.85)` }}
              />
              <span
                className="text-[10px] font-medium uppercase tracking-[0.28em] sm:text-[11px]"
                style={{ color: `rgba(${accentRGB},0.9)` }}
              >
                Калькулятор и прайс
              </span>
              <span
                className="hidden h-px flex-1 max-w-[120px] sm:block"
                style={{ backgroundColor: `rgba(${accentRGB},0.25)` }}
              />
            </div>

            <h2
              className="font-heading text-3xl leading-[1.02] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ color: "var(--text)" }}
            >
              Стоимость
              <br className="sm:hidden" />
              <span className="sm:ml-2">без </span>
              <span style={{ color: `rgba(${accentRGB},1)` }}>скрытых</span>
              <span> доплат</span>
            </h2>
          </div>

          <div className="flex justify-start md:col-span-5 md:justify-end">
            <div
              className="max-w-[min(100%,20rem)] border-l-2 py-0.5 pl-4 sm:max-w-md sm:pl-5 md:max-w-[19rem] lg:max-w-[21rem]"
              style={{ borderColor: `rgba(${accentRGB},0.4)` }}
            >
              <p
                className="space-y-2.5 text-[13px] leading-[1.55] sm:text-sm sm:leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="block font-medium tracking-tight" style={{ color: "var(--text)" }}>
                  Ориентир по объекту — в калькуляторе.
                </span>
                <span className="block text-[12px] leading-[1.6] sm:text-[13px] sm:leading-relaxed">
                  Актуальный прайс скачайте ниже. Итоговую смету согласуем после осмотра — без навязанных позиций.
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-7 sm:gap-4 md:mb-8 md:grid-cols-4">
          {ADVANTAGES.map((adv, i) => {
            const Icon = adv.icon;
            const isHovered = hoveredCard === i;
            return (
              <div
                key={i}
                role="presentation"
                className="group relative cursor-default overflow-hidden rounded-2xl border p-4 transition-colors duration-300 sm:p-5 md:p-6"
                style={{
                  backgroundColor: isDark ? "var(--card-bg)" : "var(--bg-secondary)",
                  borderColor: isHovered ? `rgba(${accentRGB},0.35)` : "var(--border)",
                  opacity: visible ? 1 : 0,
                  animation: visible ? `menuFadeIn 0.65s ease-out ${i * 0.08}s both` : "none",
                }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative flex min-h-[2.75rem] flex-wrap items-baseline gap-x-1.5 gap-y-0.5 sm:min-h-[3rem]">
                  <span
                    className="font-heading text-[1.375rem] leading-none tracking-tight transition-colors duration-300 sm:text-2xl md:text-[1.625rem] lg:text-[1.75rem]"
                    style={{
                      color: isHovered ? `rgba(${accentRGB},1)` : "var(--text)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {adv.value}
                  </span>
                  {adv.unit ? (
                    <span
                      className="text-[10px] font-medium leading-none tracking-[0.12em] sm:text-[11px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {adv.unit}
                    </span>
                  ) : null}
                </div>

                <div className="relative mt-3 flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: isHovered
                        ? `rgba(${accentRGB},0.15)`
                        : isDark
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                    }}
                  >
                    <Icon
                      size={15}
                      className="transition-colors duration-300"
                      style={{ color: `rgba(${accentRGB},${isHovered ? 1 : 0.65})` }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-medium uppercase leading-snug tracking-[0.14em] sm:text-[11px]"
                    style={{ color: "var(--text)" }}
                  >
                    {adv.label}
                  </span>
                </div>

                <p
                  className="relative mt-2 text-[10px] leading-relaxed normal-case tracking-normal sm:text-[11px]"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {adv.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="flex flex-col items-stretch gap-3 transition-all duration-700 delay-150 sm:flex-row sm:items-center sm:gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <Link
            href="/price#price-calculator"
            scroll={true}
            className="group relative flex min-h-[48px] items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 transition-all duration-300 hover:opacity-95 sm:px-9 sm:py-4"
            style={{
              backgroundColor: `rgba(${accentRGB},1)`,
              color: "#0A0A0A",
            }}
          >
            <Calculator size={16} className="relative z-10" />
            <span className="relative z-10 font-heading text-xs uppercase tracking-[0.1em] sm:text-sm">
              Калькулятор стоимости
            </span>
          </Link>

          <a
            href={PRICE_LIST_HREF}
            download={PRICE_LIST_FILENAME}
            className="group flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border px-7 py-3.5 transition-colors duration-300 sm:px-9 sm:py-4"
            style={{
              borderColor: "var(--border)",
              backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.5)",
            }}
          >
            <Download
              size={16}
              className="transition-colors duration-300 group-hover:text-[rgba(201,168,76,1)]"
              style={{ color: "var(--text-muted)" }}
            />
            <span
              className="font-heading text-xs uppercase tracking-[0.1em] transition-colors duration-300 group-hover:text-[var(--text)]"
              style={{ color: "var(--text-muted)" }}
            >
              Скачать прайс
            </span>
          </a>
        </div>
      </div>

      {/* Нижняя бегущая строка; якорь блока — #price-banner */}
      <div
        className="overflow-hidden border-t py-3 sm:py-3.5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.35)",
        }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: "priceTicker 28s linear infinite" }}>
          {[...Array(3)].map((_, rep) => (
            <div key={rep} className="flex shrink-0 items-center">
              {PRICE_TICKER_ITEMS.map((text, j) => (
                <span key={`${rep}-${j}`} className="mx-6 flex items-center sm:mx-8">
                  <span
                    className="mr-3 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: `rgba(${accentRGB},0.45)` }}
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] sm:text-[11px]"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {text}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
