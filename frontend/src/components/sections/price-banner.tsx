"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, Download, Zap, Shield, Clock, Award } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useModal } from "@/lib/modal-context";

const ADVANTAGES = [
  { icon: Zap, label: "Собственный штат", value: "15+", unit: "инженеров", desc: "Без субподряда" },
  { icon: Shield, label: "Допуск СРО", value: "100%", unit: "допуск", desc: "На все виды работ" },
  { icon: Clock, label: "Точные сроки", value: "0", unit: "срывов", desc: "Фиксируем в договоре" },
  { icon: Award, label: "Гарантия", value: "2", unit: "года", desc: "На все работы" },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
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
  const count12 = useCountUp(12, visible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const accentRGB = "201,168,76";

  return (
    <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Ambient glow orbs — no blur filter for performance */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "10%", left: "-10%",
            width: "50vw", height: "50vw",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${accentRGB},${isDark ? 0.05 : 0.03}) 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "5%", right: "-5%",
            width: "40vw", height: "40vw",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(${accentRGB},${isDark ? 0.03 : 0.02}) 0%, transparent 60%)`,
          }}
        />

        {/* Large background "0₽" watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-heading leading-none transition-all duration-1000"
            style={{
              fontSize: "clamp(200px, 35vw, 500px)",
              color: "var(--text)",
              opacity: visible ? 0.025 : 0,
              transform: visible ? "scale(1)" : "scale(0.9)",
              whiteSpace: "nowrap",
            }}
          >
            0 ₽
          </span>
        </div>

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(${accentRGB},0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(${accentRGB},0.02) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-20 xl:px-28">

            {/* Top: heading area */}
            <div
              className="mb-8 sm:mb-10 md:mb-14 transition-all duration-1000"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: `rgba(${accentRGB},0.8)` }}
                />
                <span
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium"
                  style={{ color: `rgba(${accentRGB},0.8)` }}
                >
                  Прозрачное ценообразование
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-8">
                <h2
                  className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.0] tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  Стоимость без
                  <br />
                  <span style={{ color: `rgba(${accentRGB},1)` }}>скрытых</span>{" "}
                  доплат
                </h2>

                <p
                  className="text-xs sm:text-sm leading-relaxed max-w-sm md:text-right md:pb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Фиксируем цену в договоре. Рассчитайте стоимость
                  онлайн или скачайте актуальный прайс-лист.
                </p>
              </div>
            </div>

            {/* Middle: advantages + stats in a horizontal strip */}
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-14"
            >
              {ADVANTAGES.map((adv, i) => {
                const Icon = adv.icon;
                const isHovered = hoveredCard === i;
                return (
                  <div
                    key={i}
                    className="relative p-4 sm:p-5 md:p-6 rounded-2xl cursor-default transition-all duration-500 overflow-hidden"
                    style={{
                      backgroundColor: isHovered
                        ? (isDark ? "rgba(201,168,76,0.08)" : "rgba(201,168,76,0.06)")
                        : (isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)"),
                      border: `1px solid ${isHovered ? `rgba(${accentRGB},0.3)` : "var(--border)"}`,
                      transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                      opacity: visible ? 1 : 0,
                      animationDelay: `${i * 120}ms`,
                      animation: visible ? `menuFadeIn 0.7s ease-out ${i * 0.12}s both` : "none",
                    }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Large value */}
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span
                        className="font-heading text-2xl sm:text-3xl md:text-4xl leading-none transition-colors duration-500"
                        style={{ color: isHovered ? `rgba(${accentRGB},1)` : "var(--text)" }}
                      >
                        {adv.value}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {adv.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon
                        size={13}
                        className="shrink-0 transition-colors duration-500"
                        style={{ color: `rgba(${accentRGB},${isHovered ? 1 : 0.6})` }}
                      />
                      <span
                        className="text-[11px] sm:text-xs font-medium uppercase tracking-wide"
                        style={{ color: "var(--text)" }}
                      >
                        {adv.label}
                      </span>
                    </div>

                    <p
                      className="text-[10px] sm:text-[11px] leading-relaxed"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      {adv.desc}
                    </p>

                    {/* Corner accent on hover */}
                    <div
                      className="absolute top-0 right-0 w-12 h-12 transition-opacity duration-500"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        background: `linear-gradient(225deg, rgba(${accentRGB},0.15) 0%, transparent 60%)`,
                        borderRadius: "0 1rem 0 0",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom: CTA row */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 transition-all duration-1000 delay-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <button
                onClick={openModal}
                className="group relative flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full overflow-hidden transition-all duration-500 hover:shadow-lg"
                style={{
                  backgroundColor: `rgba(${accentRGB},1)`,
                  color: "#0A0A0A",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.15) 100%)`,
                    animation: "priceShimmer 2s ease-in-out infinite",
                  }}
                />
                <Calculator size={16} className="relative z-10" />
                <span className="relative z-10 text-xs sm:text-sm font-heading uppercase tracking-[0.1em]">
                  Калькулятор стоимости
                </span>
              </button>

              <Link
                href="/price"
                className="group flex items-center justify-center gap-2.5 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full transition-all duration-500"
                style={{
                  border: "1px solid var(--border)",
                }}
              >
                <Download
                  size={16}
                  className="transition-colors duration-500 group-hover:text-[rgba(201,168,76,1)]"
                  style={{ color: "var(--text-muted)" }}
                />
                <span
                  className="text-xs sm:text-sm font-heading uppercase tracking-[0.1em] transition-colors duration-500 group-hover:text-[var(--text)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Скачать прайс
                </span>
              </Link>

              {/* Stats inline on desktop */}
              <div className="hidden md:flex items-center gap-6 ml-auto">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-heading text-3xl lg:text-4xl leading-none"
                    style={{ color: `rgba(${accentRGB},1)` }}
                  >
                    {count12}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    лет опыта
                  </span>
                </div>
                <div
                  className="w-px h-8"
                  style={{ backgroundColor: "var(--border)" }}
                />
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-heading text-3xl lg:text-4xl leading-none"
                    style={{ color: `rgba(${accentRGB},1)` }}
                  >
                    {count280}+
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    объектов
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Running ticker at bottom */}
          <div
            className="border-t overflow-hidden py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="flex whitespace-nowrap"
              style={{ animation: "priceTicker 25s linear infinite" }}
            >
              {[...Array(3)].map((_, rep) => (
                <div key={rep} className="flex items-center shrink-0">
                  {[
                    "Электромонтаж",
                    "Акустика",
                    "Слаботочные системы",
                    "Умный дом",
                    "Проектирование",
                    "Видеонаблюдение",
                    "Допуск СРО",
                    "Гарантия 2 года",
                  ].map((text, j) => (
                    <span key={j} className="flex items-center mx-6 sm:mx-8">
                      <span
                        className="w-1.5 h-1.5 rounded-full mr-3 shrink-0"
                        style={{ backgroundColor: `rgba(${accentRGB},0.4)` }}
                      />
                      <span
                        className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]"
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
