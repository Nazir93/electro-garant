"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, Download, Zap, Shield, Clock, Award } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useModal } from "@/lib/modal-context";

const ADVANTAGES = [
  { icon: Zap, label: "Собственный штат", desc: "15+ инженеров без субподряда" },
  { icon: Shield, label: "Допуск СРО", desc: "На все виды работ" },
  { icon: Clock, label: "Точные сроки", desc: "Фиксируем в договоре" },
  { icon: Award, label: "Гарантия 2 года", desc: "На все выполненные работы" },
];

export function PriceBannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [calcHovered, setCalcHovered] = useState(false);
  const [priceHovered, setPriceHovered] = useState(false);
  const { isDark } = useTheme();
  const { openModal } = useModal();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Decorative diagonal line */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            top: 0, right: "38%", bottom: 0,
            width: "1px",
            background: isDark
              ? "linear-gradient(180deg, transparent 10%, rgba(201,168,76,0.15) 50%, transparent 90%)"
              : "linear-gradient(180deg, transparent 10%, rgba(201,168,76,0.2) 50%, transparent 90%)",
            transform: "rotate(15deg) scaleY(1.4)",
            transformOrigin: "top center",
          }}
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* ── Main content ── */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 px-5 sm:px-8 md:px-0">

            {/* ── Left: promo text ── */}
            <div
              className="md:w-[50%] lg:w-[45%] md:pl-[8%] lg:pl-[12%] md:pr-8 transition-all duration-1000"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
              }}
            >
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div
                  className="w-8 h-[1px]"
                  style={{ backgroundColor: "rgba(201,168,76,0.6)" }}
                />
                <span
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium"
                  style={{ color: "rgba(201,168,76,0.8)" }}
                >
                  Прозрачное ценообразование
                </span>
              </div>

              <h2
                className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight mb-4 md:mb-6"
                style={{ color: "var(--text)" }}
              >
                Стоимость без{" "}
                <span style={{ color: "rgba(201,168,76,1)" }}>скрытых</span>{" "}
                доплат
              </h2>

              <p
                className="text-xs sm:text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-md"
                style={{ color: "var(--text-muted)" }}
              >
                Мы фиксируем цену в договоре и не меняем её в процессе работы. 
                Рассчитайте стоимость онлайн или скачайте актуальный прайс-лист 
                с ценами на все виды электромонтажных работ в Сочи.
              </p>

              {/* ── CTA buttons ── */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={openModal}
                  onMouseEnter={() => setCalcHovered(true)}
                  onMouseLeave={() => setCalcHovered(false)}
                  className="group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full overflow-hidden transition-all duration-500"
                  style={{
                    backgroundColor: calcHovered ? "rgba(201,168,76,1)" : "transparent",
                    border: "1px solid rgba(201,168,76,0.6)",
                  }}
                >
                  <Calculator
                    size={16}
                    className="transition-colors duration-500"
                    style={{ color: calcHovered ? "#0A0A0A" : "rgba(201,168,76,1)" }}
                  />
                  <span
                    className="text-xs sm:text-sm font-heading uppercase tracking-[0.1em] transition-colors duration-500"
                    style={{ color: calcHovered ? "#0A0A0A" : "var(--text)" }}
                  >
                    Калькулятор стоимости
                  </span>
                </button>

                <Link
                  href="/price"
                  onMouseEnter={() => setPriceHovered(true)}
                  onMouseLeave={() => setPriceHovered(false)}
                  className="group flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: priceHovered ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Download
                    size={16}
                    className="transition-colors duration-500"
                    style={{ color: priceHovered ? "rgba(201,168,76,1)" : "var(--text-muted)" }}
                  />
                  <span
                    className="text-xs sm:text-sm font-heading uppercase tracking-[0.1em] transition-colors duration-500"
                    style={{ color: priceHovered ? "var(--text)" : "var(--text-muted)" }}
                  >
                    Скачать прайс
                  </span>
                </Link>
              </div>
            </div>

            {/* ── Right: advantages grid ── */}
            <div
              className="md:w-[50%] lg:w-[45%] md:pr-[8%] lg:pr-[12%] md:pl-8 transition-all duration-1000 delay-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
              }}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {ADVANTAGES.map((adv, i) => {
                  const Icon = adv.icon;
                  return (
                    <div
                      key={i}
                      className="group p-4 sm:p-5 md:p-6 rounded-2xl transition-all duration-500 hover:scale-[1.03]"
                      style={{
                        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        border: "1px solid var(--border)",
                        transitionDelay: `${i * 100}ms`,
                      }}
                    >
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 group-hover:scale-110"
                        style={{
                          backgroundColor: "rgba(201,168,76,0.1)",
                          border: "1px solid rgba(201,168,76,0.2)",
                        }}
                      >
                        <Icon size={16} style={{ color: "rgba(201,168,76,0.8)" }} />
                      </div>
                      <h4
                        className="text-xs sm:text-sm font-heading uppercase tracking-wide mb-1"
                        style={{ color: "var(--text)" }}
                      >
                        {adv.label}
                      </h4>
                      <p
                        className="text-[10px] sm:text-[11px] leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {adv.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Bottom tagline ── */}
          <div
            className="py-4 sm:py-5 md:py-6 border-t text-center transition-all duration-1000 delay-500"
            style={{
              borderColor: "var(--border)",
              opacity: visible ? 1 : 0,
            }}
          >
            <p
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]"
              style={{ color: "var(--text-subtle)" }}
            >
              12 лет опыта • 280+ объектов • Допуск СРО • Гарантия по договору
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
