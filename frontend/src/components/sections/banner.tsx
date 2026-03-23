"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useModal } from "@/lib/modal-context";
import { useTheme } from "@/lib/theme-context";

const ANNOTATIONS = [
  {
    id: "security",
    label: "Видеонаблюдение",
    desc: "IP-камеры, контроль доступа",
    href: "/services/security",
    dotX: 33, dotY: 33,
    labelX: 15, labelY: 24,
    align: "left" as const,
    icon: "eye",
  },
  {
    id: "acoustics",
    label: "Акустика",
    desc: "Звуковые системы для бизнеса",
    href: "/services/acoustics",
    dotX: 37, dotY: 50,
    labelX: 8, labelY: 28,
    align: "right" as const,
    icon: "speaker",
  },
  {
    id: "electrical",
    label: "Электромонтаж",
    desc: "Силовые сети, освещение",
    href: "/services/electrical",
    dotX: 53, dotY: 46,
    labelX: 20, labelY: 65,
    align: "right" as const,
    icon: "zap",
  },
  {
    id: "smart-home",
    label: "Умный дом",
    desc: "Автоматизация и управление",
    href: "/services/smart-home",
    dotX: 58, dotY: 60,
    labelX: 23, labelY: 68,
    align: "left" as const,
    icon: "home",
  },
  {
    id: "cabling",
    label: "Слаботочные системы",
    desc: "СКС, интернет, телефония",
    href: "/services/structured-cabling",
    dotX: 28, dotY: 60,
    labelX: 8, labelY: 59,
    align: "right" as const,
    icon: "network",
  },
  {
    id: "lighting",
    label: "Архитектурная подсветка",
    desc: "LED-подсветка фасадов и интерьеров",
    href: "/services/electrical",
    dotX: 55, dotY: 34,
    labelX: 40, labelY: 25,
    align: "left" as const,
    icon: "light",
  },
];

const ICONS: Record<string, React.ReactNode> = {
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  speaker: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  network: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
};

export function BannerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bannerCtaHovered, setBannerCtaHovered] = useState(false);
  const { openModal } = useModal();
  const { isDark } = useTheme();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        height: "100dvh",
        minHeight: "600px",
        backgroundColor: isDark ? "#000000" : "#FFFFFF",
        cursor: "none",
      }}
    >
      {/* ============== Mobile + Tablet: title at top (чуть ниже) ============== */}
      <div
        className="absolute md:hidden top-20 sm:top-24 left-0 right-0 z-[6] flex justify-center transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
      >
        <h1 className="font-heading font-bold leading-[0.92] tracking-tight text-center">
          <span
            className="block text-[clamp(36px,10vw,70px)] sm:text-[clamp(44px,8vw,72px)]"
            style={{ color: "rgba(201,168,76,1)" }}
          >
            ГАРАНТ
          </span>
          <span className="block text-[clamp(36px,10vw,70px)] sm:text-[clamp(44px,8vw,72px)]">
            {isDark ? (
              <span style={{ color: "#fff" }}>МОНТАЖ</span>
            ) : (
              <>
                <span style={{ color: "#0A0A0A" }}>МОНТА</span>
                <span
                  style={{
                    color: "#0A0A0A",
                    textShadow:
                      "0 0 8px #fff, 0 0 16px rgba(255,255,255,0.95), 0 0 24px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.35)",
                  }}
                >
                  Ж
                </span>
              </>
            )}
          </span>
        </h1>
      </div>

      {/* ============== LAYOUT: left text (desktop) + house ============== */}
      <div className="relative z-[2] h-full flex items-center md:flex-row">

        {/* ---- LEFT: Title (desktop only) ---- */}
        <div className="hidden md:flex flex-shrink-0 w-[25%] lg:w-[32%] h-full flex-col items-start justify-end pl-[12%] lg:pl-[16%] pr-4 pb-[16%] lg:pb-[18%] z-[5]">
          <div
            className="transition-all duration-1000"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <div className="w-fit max-w-full">
              <h1 className="font-heading font-bold leading-[0.92] tracking-tight">
                <span
                  className="block text-[clamp(36px,7vw,90px)]"
                  style={{ color: "rgba(201,168,76,1)" }}
                >
                  ГАРАНТ
                </span>
                <span className="block text-[clamp(36px,7vw,90px)]">
                  {isDark ? (
                    <span style={{ color: "#fff" }}>МОНТАЖ</span>
                  ) : (
                    <>
                      <span style={{ color: "#0A0A0A" }}>МОНТА</span>
                      <span
                        style={{
                          color: "#0A0A0A",
                          textShadow:
                            "0 0 10px #fff, 0 0 20px rgba(255,255,255,0.95), 0 0 32px rgba(255,255,255,0.75), 0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        Ж
                      </span>
                    </>
                  )}
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* ---- Mobile/Tablet: фото дома ---- */}
        <div className="flex-1 md:hidden h-full flex flex-col items-center justify-center relative min-h-0 overflow-hidden">
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[140%] h-[80%] transition-all duration-1000 delay-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.92)",
            }}
          >
            <Image
              src={isDark ? "/IMG_0980.PNG" : "/logo/photo_2026-03-20_15-02-09.jpg"}
              alt="Гарант Монтаж"
              fill
              className="object-contain object-left"
              priority
              sizes="140vw"
            />
          </div>

        </div>

        {/* ---- House image + annotation dots + label cards (desktop only) ---- */}
        <div className="hidden md:flex flex-1 h-full items-center justify-center relative px-0">
          <div
            className="relative w-[85%] sm:w-[70%] max-w-[500px] md:max-w-none md:w-[105%] lg:w-[100%] aspect-square transition-all duration-1000 delay-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.92)",
            }}
          >
            {/* House image: дневной вариант — белый дом с тенью, ночной — тёмный */}
            <Image
              src={isDark ? "/IMG_0980.PNG" : "/logo/photo_2026-03-20_15-02-09.jpg"}
              alt="Гарант Монтаж — полный цикл электромонтажных работ"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 0vw, 60vw"
            />

            {/* ---- SVG: dots + connecting lines ---- */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 2 }}
            >
              {ANNOTATIONS.map((a) => {
                const isHov = hoveredId === a.id;
                return (
                  <g
                    key={a.id}
                    className="transition-opacity duration-500"
                    style={{ opacity: visible ? 1 : 0 }}
                  >
                    {/* Line from dot to label */}
                    <line
                      x1={a.dotX}
                      y1={a.dotY}
                      x2={a.labelX}
                      y2={a.labelY}
                      stroke={isHov ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.25)"}
                      strokeWidth="0.2"
                      strokeDasharray="0.8 0.6"
                      className="transition-all duration-300"
                    />

                    {/* Center dot */}
                    <circle
                      cx={a.dotX}
                      cy={a.dotY}
                      r={isHov ? 1.2 : 0.8}
                      fill={isHov ? "rgba(201,168,76,1)" : "rgba(201,168,76,0.8)"}
                      className="transition-all duration-300"
                    />

                    {/* Label endpoint dot */}
                    <circle
                      cx={a.labelX}
                      cy={a.labelY}
                      r="0.5"
                      fill="rgba(201,168,76,0.6)"
                    />
                  </g>
                );
              })}
            </svg>

            {/* ---- Floating label cards around the house (desktop) ---- */}
            {ANNOTATIONS.map((a, i) => {
              const isHov = hoveredId === a.id;
              const isLeft = a.align === "left";
              return (
                <div
                  key={a.id}
                  className="absolute hidden md:flex items-center gap-1.5 z-[3] transition-all duration-500 cursor-none"
                  style={{
                    top: `${a.labelY}%`,
                    left: isLeft ? `${a.labelX}%` : undefined,
                    right: !isLeft ? `${100 - a.labelX}%` : undefined,
                    opacity: visible ? 1 : 0,
                    transitionDelay: `${700 + i * 120}ms`,
                  }}
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Link
                    href={a.href}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 cursor-none"
                    style={{
                      backgroundColor: isDark
                        ? (isHov ? "rgba(201,168,76,0.15)" : "rgba(0,0,0,0.75)")
                        : (isHov ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.95)"),
                      border: isDark
                        ? `1px solid ${isHov ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)"}`
                        : `1px solid ${isHov ? "rgba(201,168,76,0.5)" : "rgba(0,0,0,0.12)"}`,
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                      style={{
                        backgroundColor: isDark ? (isHov ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.1)") : (isHov ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.12)"),
                        color: isDark ? (isHov ? "rgba(201,168,76,1)" : "rgba(255,255,255,0.5)") : (isHov ? "rgba(201,168,76,1)" : "rgba(0,0,0,0.6)"),
                      }}
                    >
                      {ICONS[a.icon]}
                    </span>
                    <span
                      className="text-[9px] lg:text-[10px] tracking-wide uppercase whitespace-nowrap transition-colors duration-300 pr-1"
                      style={{
                        color: isDark ? (isHov ? "rgba(201,168,76,1)" : "rgba(255,255,255,0.7)") : (isHov ? "rgba(201,168,76,1)" : "rgba(0,0,0,0.75)"),
                      }}
                    >
                      {a.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ---- Кнопка на месте бывшего слогана (центр) ---- */}
      <div
        className="absolute bottom-20 sm:bottom-24 md:bottom-16 left-0 right-0 z-[7] flex items-center justify-center px-4 transition-all duration-1000 delay-[800ms]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <button
          type="button"
          onClick={openModal}
          onMouseEnter={() => setBannerCtaHovered(true)}
          onMouseLeave={() => setBannerCtaHovered(false)}
          className="group relative flex items-center justify-between gap-2 sm:gap-3 px-5 sm:px-7 py-2.5 sm:py-3 max-w-[min(92vw,520px)] w-full sm:w-auto overflow-hidden transition-colors duration-700 cursor-pointer md:cursor-none"
          style={{
            border: `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"}`,
            borderRadius: "14px",
            backgroundColor: isDark ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.92)",
            boxShadow: isDark
              ? "0 0 14px rgba(201,168,76,0.4), 0 0 28px rgba(201,168,76,0.2)"
              : "2px 0 12px rgba(255,255,255,0.7), 4px 0 24px rgba(255,255,255,0.4)",
          }}
          aria-label="Рассчитать стоимость работ"
        >
          <div
            className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              backgroundColor: isDark ? "#FFFFFF" : "#0A0A0A",
              transform: bannerCtaHovered ? "scaleX(1)" : "scaleX(0)",
            }}
          />
          <span
            className="relative z-10 font-heading text-[10px] sm:text-xs md:text-[13px] uppercase tracking-[0.1em] sm:tracking-[0.14em] leading-tight text-left transition-colors duration-700 flex-1"
            style={{
              color: bannerCtaHovered
                ? (isDark ? "#0A0A0A" : "#FFFFFF")
                : (isDark ? "#FFFFFF" : "#0A0A0A"),
            }}
          >
            Рассчитать стоимость работ
          </span>
          <ArrowRight
            size={16}
            className="relative z-10 shrink-0 transition-colors duration-700"
            style={{
              color: bannerCtaHovered
                ? (isDark ? "#0A0A0A" : "#FFFFFF")
                : (isDark ? "#FFFFFF" : "#0A0A0A"),
            }}
          />
        </button>
      </div>

      {/* ---- Лозунг ниже кнопки ---- */}
      <div
        className="absolute bottom-6 sm:bottom-8 md:bottom-7 left-0 right-0 z-[7] flex items-center justify-center px-4 transition-all duration-1000 delay-[1000ms]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <p
          className="text-[13px] sm:text-[15px] md:text-[clamp(14px,1.6vw,22px)] font-light tracking-wide text-center max-w-[95vw] sm:whitespace-nowrap"
          style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(10,10,10,0.9)" }}
        >
          Мы не создаём проблем — мы их решаем
        </p>
      </div>

    </section>
  );
}
