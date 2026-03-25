"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useModal } from "@/lib/modal-context";
import { useTheme } from "@/lib/theme-context";

type AnnotationItem = {
  id: string;
  label: string;
  desc: string;
  href: string;
  dotX: number;
  dotY: number;
  labelX: number;
  labelY: number;
  align: "left" | "right";
  icon: string;
  /** Конец линии (центр чипа); иначе x2/y2 = labelX/labelY. Для align:right — правый край у labelX, центр левее (меньше lineEndX). */
  lineEndX?: number;
  lineEndY?: number;
};

const ANNOTATIONS: AnnotationItem[] = [
  {
    id: "security",
    label: "Видеонаблюдение",
    desc: "IP-камеры, контроль доступа",
    href: "/services/security",
    dotX: 33, dotY: 33,
    labelX: 15, labelY: 24,
    align: "left",
    icon: "eye",
    lineEndX: 23,
    lineEndY: 24,
  },
  {
    id: "acoustics",
    label: "Акустика",
    desc: "Звуковые системы для бизнеса",
    href: "/services/acoustics",
    dotX: 37, dotY: 50,
    labelX: 8, labelY: 28,
    align: "right",
    icon: "speaker",
  },
  {
    id: "electrical",
    label: "Электромонтаж",
    desc: "Силовые сети, освещение",
    href: "/services/electrical",
    dotX: 53, dotY: 46,
    labelX: 20, labelY: 63,
    align: "right",
    icon: "zap",
  },
  {
    id: "smart-home",
    label: "Умный дом",
    desc: "Автоматизация и управление",
    href: "/services/smart-home",
    dotX: 58, dotY: 60,
    labelX: 23, labelY: 68,
    align: "left",
    icon: "home",
  },
  {
    id: "cabling",
    label: "Слаботочные системы",
    desc: "СКС, интернет, телефония",
    href: "/services/structured-cabling",
    dotX: 72, dotY: 59,
    labelX: 90, labelY: 68,
    align: "right",
    icon: "network",
    lineEndX: 75,
    lineEndY: 68,
  },
  {
    id: "lighting",
    label: "Архитектурная подсветка",
    desc: "LED-подсветка фасадов и интерьеров",
    href: "/services/electrical",
    dotX: 55, dotY: 34,
    labelX: 40, labelY: 25,
    align: "left",
    icon: "light",
    lineEndX: 53,
    lineEndY: 25,
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

function BannerCalcCtaButton({
  isDark,
  openModal,
  bannerCtaHovered,
  setBannerCtaHovered,
  className,
}: {
  isDark: boolean;
  openModal: () => void;
  bannerCtaHovered: boolean;
  setBannerCtaHovered: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={openModal}
      onMouseEnter={() => setBannerCtaHovered(true)}
      onMouseLeave={() => setBannerCtaHovered(false)}
      className={
        "group relative flex min-h-[44px] sm:min-h-[48px] min-w-0 items-center justify-center overflow-hidden px-6 py-2 transition-colors duration-700 sm:px-8 md:px-10 sm:py-2.5 cursor-pointer md:cursor-none " +
        (className ?? "")
      }
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
          backgroundColor: "rgba(201,168,76,0.98)",
          transform: bannerCtaHovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      <span
        className="relative z-10 block w-full min-w-0 pl-2 pr-10 text-center font-heading text-xs uppercase leading-tight tracking-[0.08em] transition-colors duration-700 sm:pr-11 sm:text-sm sm:tracking-[0.1em] md:pr-12 md:text-[clamp(13px,1.05vw,15px)] lg:text-base"
        style={{
          color: bannerCtaHovered ? "#0A0A0A" : isDark ? "#FFFFFF" : "#0A0A0A",
        }}
      >
        Рассчитать стоимость работ
      </span>
      <ArrowRight
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 z-10 shrink-0 -translate-y-1/2 transition-colors duration-700 sm:right-4 md:right-5"
        style={{
          color: bannerCtaHovered ? "#0A0A0A" : isDark ? "#FFFFFF" : "#0A0A0A",
        }}
      />
    </button>
  );
}

export function BannerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [bannerCtaHovered, setBannerCtaHovered] = useState(false);
  const { openModal } = useModal();
  const { isDark } = useTheme();

  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
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
        className="absolute md:hidden top-20 sm:top-24 left-0 right-0 z-[6] flex justify-center transition-all duration-[750ms] ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(1.25rem)" : "translateY(30px)",
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
      <div className="relative z-[2] h-full flex items-center md:flex-row md:gap-10 lg:gap-14 xl:gap-20">

        {/* ---- LEFT: Title (desktop only) — vertically centred, stable across viewports ---- */}
        <div className="z-[5] hidden h-full w-[25%] flex-shrink-0 flex-col items-start justify-center overflow-visible pl-[12%] pr-6 md:flex lg:w-[32%] lg:pl-[16%] lg:pr-10">
          <div
            className="transition-all duration-[750ms] ease-out"
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
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[140%] h-[80%] transition-all duration-[750ms] ease-out delay-100"
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
            className="relative w-[85%] sm:w-[70%] max-w-[500px] md:max-w-none md:w-[105%] lg:w-[100%] aspect-square transition-all duration-[750ms] ease-out delay-100"
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

            {/* ---- SVG: линии дом — метки (без кружков на концах) ---- */}
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
                    <line
                      x1={a.dotX}
                      y1={a.dotY}
                      x2={a.lineEndX ?? a.labelX}
                      y2={a.lineEndY ?? a.labelY}
                      stroke={isHov ? "rgba(201,168,76,0.7)" : "rgba(201,168,76,0.25)"}
                      strokeWidth="0.2"
                      strokeDasharray="0.8 0.6"
                      className="transition-all duration-300"
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
                  className="absolute hidden md:flex cursor-none items-center gap-1.5 z-[3] transition-all duration-[550ms] ease-out"
                  style={{
                    top: `${a.labelY}%`,
                    left: isLeft ? `${a.labelX}%` : undefined,
                    right: !isLeft ? `${100 - a.labelX}%` : undefined,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(-50%)" : "translateY(calc(-50% + 6px))",
                    transitionDelay: `${220 + i * 45}ms`,
                  }}
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Link
                    href={a.href}
                    className="flex cursor-none items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-all duration-300"
                    style={{
                      backgroundColor: isDark
                        ? (isHov ? "rgba(30,26,15,1)" : "rgba(0,0,0,1)")
                        : (isHov ? "rgba(255,248,230,1)" : "rgba(255,255,255,1)"),
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

      {/* ---- Desktop CTA button (pinned to bottom, does not shift with viewport height) ---- */}
      <div
        className="hidden md:flex absolute bottom-20 lg:bottom-24 left-[12%] lg:left-[16%] right-[3%] z-[8] transition-all delay-100 duration-[750ms] ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        <BannerCalcCtaButton
          isDark={isDark}
          openModal={openModal}
          bannerCtaHovered={bannerCtaHovered}
          setBannerCtaHovered={setBannerCtaHovered}
          className="w-full"
        />
      </div>

      {/* ---- Кнопка mobile / tablet (по центру) ---- */}
      <div
        className="absolute bottom-14 left-0 right-0 z-[7] flex items-center justify-center px-4 transition-all duration-[700ms] ease-out delay-[260ms] sm:bottom-[4.5rem] md:hidden"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <BannerCalcCtaButton
          isDark={isDark}
          openModal={openModal}
          bannerCtaHovered={bannerCtaHovered}
          setBannerCtaHovered={setBannerCtaHovered}
          className="w-full max-w-[min(94vw,920px)]"
        />
      </div>

      {/* ---- Лозунг ниже кнопки ---- */}
      <div
        className="absolute bottom-6 sm:bottom-8 md:bottom-7 left-0 right-0 z-[7] flex items-center justify-center px-4 transition-all duration-[700ms] ease-out delay-[400ms]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <p
          className="text-[12px] sm:text-[14px] md:text-[clamp(13px,1.45vw,19px)] font-light tracking-wide text-center max-w-[95vw] sm:whitespace-nowrap"
          style={{ color: isDark ? "rgba(255,255,255,0.9)" : "rgba(10,10,10,0.9)" }}
        >
          Мы не создаём проблем — мы их решаем
        </p>
      </div>

    </section>
  );
}
