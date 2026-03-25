"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, Download, Zap, Award, BadgeCheck, ListChecks } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useModal } from "@/lib/modal-context";

const ADVANTAGES = [
  { icon: Zap, label: "Собственный штат", value: "15+", unit: "инженеров", desc: "Без субподряда и «левых» бригад" },
  {
    icon: BadgeCheck,
    label: "Смета до старта",
    value: "0",
    unit: "скрытых строк",
    desc: "Состав и цена согласованы до подписания договора",
  },
  {
    icon: ListChecks,
    label: "Понятные этапы",
    value: "По",
    unit: "договору",
    desc: "Сроки этапов и приёмка прописаны заранее — всегда ясно, что сделано и что дальше",
  },
  { icon: Award, label: "Гарантия", value: "5", unit: "лет", desc: "На монтаж и подключённое оборудование" },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return val;
}

export function PriceBannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { isDark } = useTheme();
  const { openModal } = useModal();

  const count280 = useCountUp(280, visible);
  const count13 = useCountUp(13, visible);

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

  const accentRGB = "201,168,76";

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Верхняя золотая линия-акцент */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(${accentRGB},0.55), transparent)`,
        }}
      />

      {/* Лёгкий диагональный слой */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.45]"
        style={{
          background: isDark
            ? `linear-gradient(165deg, rgba(${accentRGB},0.06) 0%, transparent 42%, rgba(255,255,255,0.02) 100%)`
            : `linear-gradient(165deg, rgba(${accentRGB},0.07) 0%, transparent 45%, rgba(0,0,0,0.02) 100%)`,
        }}
      />

      <div className="min-h-[100dvh]">
        <div
          className="absolute pointer-events-none"
          style={{
            top: "8%",
            left: "-8%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${accentRGB},${isDark ? 0.07 : 0.05}) 0%, transparent 58%)`,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "0%",
            right: "-6%",
            width: "38vw",
            height: "38vw",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${accentRGB},${isDark ? 0.04 : 0.03}) 0%, transparent 55%)`,
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        >
          <span
            className="font-heading leading-none transition-all duration-1000"
            style={{
              fontSize: "clamp(180px, 32vw, 460px)",
              color: "var(--text)",
              opacity: visible ? 0.022 : 0,
              transform: visible ? "scale(1)" : "scale(0.9)",
              whiteSpace: "nowrap",
            }}
          >
            0 ₽
          </span>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(${accentRGB},0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRGB},0.028) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 45%, black 20%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-1 flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28">
            {/* Заголовок + слоган — ровная сетка */}
            <div
              className="mb-7 transition-all duration-1000 sm:mb-9 md:mb-11 md:grid md:grid-cols-12 md:items-end md:gap-x-10 lg:gap-x-14"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
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
                    Фиксируем цены
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
                      Цена фиксируется в договоре до начала работ.
                    </span>
                    <span className="block text-[12px] leading-[1.6] sm:text-[13px] sm:leading-relaxed">
                      Онлайн-калькулятор и актуальный прайс — без сюрпризов в процессе.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Карточки */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6 sm:gap-4 md:mb-7 md:grid-cols-4">
              {ADVANTAGES.map((adv, i) => {
                const Icon = adv.icon;
                const isHovered = hoveredCard === i;
                return (
                  <div
                    key={i}
                    role="presentation"
                    className="group relative cursor-default overflow-hidden rounded-3xl p-4 transition-all duration-500 sm:p-5 md:p-6"
                    style={{
                      backgroundColor: isHovered
                        ? isDark
                          ? "rgba(201,168,76,0.09)"
                          : "rgba(201,168,76,0.07)"
                        : isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(255,255,255,0.65)",
                      border: `1px solid ${isHovered ? `rgba(${accentRGB},0.35)` : "var(--border)"}`,
                      boxShadow: isHovered
                        ? isDark
                          ? `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(${accentRGB},0.12)`
                          : `0 14px 36px rgba(0,0,0,0.08), 0 0 0 1px rgba(${accentRGB},0.15)`
                        : isDark
                          ? "0 4px 24px rgba(0,0,0,0.2)"
                          : "0 4px 20px rgba(0,0,0,0.04)",
                      transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                      opacity: visible ? 1 : 0,
                      animation: visible ? `menuFadeIn 0.75s ease-out ${i * 0.1}s both` : "none",
                    }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className="absolute bottom-0 left-0 top-0 w-[3px] transition-opacity duration-500"
                      style={{
                        borderRadius: "12px 0 0 12px",
                        background: `linear-gradient(180deg, rgba(${accentRGB},0.95), rgba(${accentRGB},0.35))`,
                        opacity: isHovered ? 1 : 0.2,
                      }}
                    />

                    <div className="relative flex items-baseline gap-1.5 pl-1">
                      <span
                        className="font-heading text-2xl leading-none transition-colors duration-500 sm:text-3xl md:text-4xl"
                        style={{
                          color: isHovered ? `rgba(${accentRGB},1)` : "var(--text)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {adv.value}
                      </span>
                      <span
                        className="text-[10px] uppercase tracking-wider sm:text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {adv.unit}
                      </span>
                    </div>

                    <div className="relative mt-3 flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-500"
                        style={{
                          backgroundColor: isHovered
                            ? `rgba(${accentRGB},0.2)`
                            : isDark
                              ? "rgba(255,255,255,0.06)"
                              : "rgba(0,0,0,0.04)",
                        }}
                      >
                        <Icon
                          size={15}
                          className="transition-colors duration-500"
                          style={{ color: `rgba(${accentRGB},${isHovered ? 1 : 0.65})` }}
                        />
                      </div>
                      <span
                        className="text-[11px] font-medium uppercase tracking-wide sm:text-xs"
                        style={{ color: "var(--text)" }}
                      >
                        {adv.label}
                      </span>
                    </div>

                    <p
                      className="relative mt-2 pl-1 text-[10px] leading-relaxed sm:text-[11px]"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      {adv.desc}
                    </p>

                    <div
                      className="absolute right-0 top-0 h-16 w-16 transition-opacity duration-500"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        background: `linear-gradient(225deg, rgba(${accentRGB},0.18) 0%, transparent 55%)`,
                        borderRadius: "0 1.5rem 0 0",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Кнопки — чуть выше карточек */}
            <div
              className="-mt-1 flex flex-col items-stretch gap-3 transition-all duration-1000 delay-300 sm:-mt-2 sm:flex-row sm:items-center sm:gap-4 md:-mt-3"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
              }}
            >
              <button
                type="button"
                onClick={openModal}
                className="group relative flex min-h-[48px] items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 transition-all duration-500 hover:shadow-lg sm:px-9 sm:py-4"
                style={{
                  backgroundColor: `rgba(${accentRGB},1)`,
                  color: "#0A0A0A",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(255,255,255,0.18) 100%)`,
                    animation: "priceShimmer 2s ease-in-out infinite",
                  }}
                />
                <Calculator size={16} className="relative z-10" />
                <span className="relative z-10 font-heading text-xs uppercase tracking-[0.1em] sm:text-sm">
                  Калькулятор стоимости
                </span>
              </button>

              <Link
                href="/price"
                className="group flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border px-7 py-3.5 transition-all duration-500 sm:px-9 sm:py-4"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.5)",
                }}
              >
                <Download
                  size={16}
                  className="transition-colors duration-500 group-hover:text-[rgba(201,168,76,1)]"
                  style={{ color: "var(--text-muted)" }}
                />
                <span
                  className="font-heading text-xs uppercase tracking-[0.1em] transition-colors duration-500 group-hover:text-[var(--text)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Скачать прайс
                </span>
              </Link>

              <div className="ml-auto hidden items-center gap-6 md:flex">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-heading text-3xl leading-none lg:text-4xl"
                    style={{ color: `rgba(${accentRGB},1)`, fontVariantNumeric: "tabular-nums" }}
                  >
                    {count13}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    лет опыта
                  </span>
                </div>
                <div className="h-8 w-px" style={{ backgroundColor: "var(--border)" }} />
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-heading text-3xl leading-none lg:text-4xl"
                    style={{ color: `rgba(${accentRGB},1)`, fontVariantNumeric: "tabular-nums" }}
                  >
                    {count280}+
                  </span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    объектов
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="overflow-hidden py-3.5"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.4)",
            }}
          >
            <div className="flex whitespace-nowrap" style={{ animation: "priceTicker 28s linear infinite" }}>
              {[...Array(3)].map((_, rep) => (
                <div key={rep} className="flex shrink-0 items-center">
                  {[
                    "Электромонтаж",
                    "Акустика",
                    "Слаботочные системы",
                    "Умный дом",
                    "Проектирование",
                    "Видеонаблюдение",
                    "Смета до договора",
                    "Гарантия 5 лет",
                  ].map((text, j) => (
                    <span key={j} className="mx-6 flex items-center sm:mx-8">
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
      </div>
    </div>
  );
}
