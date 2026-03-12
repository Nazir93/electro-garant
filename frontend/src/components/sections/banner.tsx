"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { CITY } from "@/lib/constants";

const SLIDES = [
  {
    title: "ЭЛЕКТРОМОНТАЖ\nПРЕМИУМ-КЛАССА",
    subtitle: `Проектирование, поставка и монтаж\nдля ресторанов, офисов и квартир в ${CITY}`,
    label: "01",
  },
  {
    title: "ПРОЕКТИРОВАНИЕ\nПО ГОСТ",
    subtitle: "Однолинейные схемы, расчёт нагрузок,\nкабельный журнал — полный комплект документации",
    label: "02",
  },
  {
    title: "ОБОРУДОВАНИЕ\nПРЕМИУМ-БРЕНДОВ",
    subtitle: "ABB, Legrand, Schneider Electric, Hikvision —\nпрямые поставки без наценок посредников",
    label: "03",
  },
  {
    title: "ГАРАНТИЯ\n5 ЛЕТ",
    subtitle: "Собственный штат инженеров, допуск СРО\nи полная ответственность за результат",
    label: "04",
  },
];

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export function BannerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const scrollRange = sectionHeight - viewportH;
      if (scrollRange <= 0) return;
      const p = clamp(scrolled / scrollRange, 0, 1);
      setProgress(p);
      const idx = Math.min(
        Math.floor(p * SLIDES.length),
        SLIDES.length - 1
      );
      setActiveSlide(idx);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        height: `${SLIDES.length * 100}vh`,
        backgroundColor: "#0A0A0A",
      }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Background slides */}
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: i === activeSlide ? 1 : 0,
              backgroundColor: "#0A0A0A",
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(10,10,10,0.6)" }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Фото / Видео объекта {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 md:py-12">
          {/* Top: slide indicator */}
          <div className="flex items-center justify-between pt-16 sm:pt-16">
            <div className="flex items-center gap-2 sm:gap-3">
              {SLIDES.map((slide, i) => (
                <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className="h-[2px] transition-all duration-700"
                    style={{
                      width: i === activeSlide ? "28px" : "12px",
                      backgroundColor: i === activeSlide
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.2)",
                    }}
                  />
                  {i === activeSlide && (
                    <span className="text-[9px] sm:text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {slide.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center: Title */}
          <div className="flex-1 flex items-center">
            <div className="w-full relative" style={{ minHeight: "40vh" }}>
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 transition-all duration-700 ease-out"
                  style={{
                    opacity: i === activeSlide ? 1 : 0,
                    transform: i === activeSlide
                      ? "translateY(0)"
                      : i < activeSlide
                        ? "translateY(-60px)"
                        : "translateY(60px)",
                    pointerEvents: i === activeSlide ? "auto" : "none",
                  }}
                >
                  <h1
                    className="font-heading text-[clamp(24px,7vw,100px)] leading-[0.95] tracking-tight whitespace-pre-line mb-4 sm:mb-6 md:mb-8"
                    style={{ color: "#FFFFFF" }}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className="text-[11px] sm:text-xs md:text-sm leading-relaxed tracking-wide whitespace-pre-line max-w-xs sm:max-w-md"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: scroll hint */}
          <div className="flex items-end justify-end pb-safe">
            <div
              className="flex flex-col items-center gap-2 transition-opacity duration-500"
              style={{ opacity: progress < 0.1 ? 1 : 0 }}
            >
              <div
                className="w-[1px] h-10 sm:h-12 overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <div
                  className="w-full h-1/2 animate-bounce"
                  style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                />
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Листайте
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
