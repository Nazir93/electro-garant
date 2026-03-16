"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/constants";

const SLIDES = [
  {
    number: "01",
    heading: "Полный цикл электромонтажных работ",
    highlight: "280+ выполненных объектов",
    description:
      "От проектирования и закупки оборудования до монтажа и пусконаладки. Мы берём на себя все этапы — вам не нужно координировать субподрядчиков.",
    imageLabel: "Фото объекта — электрощит",
  },
  {
    number: "02",
    heading: "Собственная технология монтажа",
    highlight: "12 лет опыта и собственный штат инженеров",
    description:
      "Авторская методика монтажа, сертифицированные специалисты и допуск СРО на все виды работ. Без субподряда — полный контроль качества.",
    imageLabel: "Фото объекта — процесс монтажа",
  },
  {
    number: "03",
    heading: "Гарантия и поддержка",
    highlight: "2 года гарантия + техническая поддержка 24/7",
    description:
      "Полная ответственность за каждый выполненный объект. Проектная документация по ГОСТ, сопровождение после сдачи — мы всегда на связи.",
    imageLabel: "Фото объекта — готовый результат",
  },
];

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {count.toLocaleString("ru-RU")}
      {suffix}
    </span>
  );
}

function ConvexImagePanel({
  activeIndex,
  scrollProgress,
}: {
  activeIndex: number;
  scrollProgress: number;
}) {
  const bulgeCenter = 0.12 + scrollProgress * 0.76;
  const bulgeDepth = 0.08;
  const bulgeHalf = 0.18;
  const top = Math.max(0, bulgeCenter - bulgeHalf);
  const bot = Math.min(1, bulgeCenter + bulgeHalf);

  const d = [
    `M 0 0`,
    `L 0 ${top.toFixed(4)}`,
    `Q ${bulgeDepth} ${bulgeCenter.toFixed(4)}, 0 ${bot.toFixed(4)}`,
    `L 0 1`,
    `L 1 1`,
    `L 1 0`,
    `Z`,
  ].join(" ");

  return (
    <div className="h-full relative">
      <svg className="absolute" style={{ width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <clipPath id="convex-clip" clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        </defs>
      </svg>

      <div
        className="relative w-full h-full overflow-hidden"
        style={{ clipPath: "url(#convex-clip)" }}
      >
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
            style={{
              opacity: i === activeIndex ? 1 : 0,
              backgroundColor: "#0A0A0A",
            }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {slide.imageLabel}
            </span>
          </div>
        ))}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
    </div>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const scrollRange = sectionHeight - viewportH;
      if (scrollRange <= 0) return;
      const progress = Math.max(0, Math.min(scrolled / scrollRange, 1));
      setScrollProgress(progress);
      const idx = Math.min(
        Math.floor(progress * SLIDES.length),
        SLIDES.length - 1
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative"
      style={{
        height: `${SLIDES.length * 100}vh`,
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">

          {/* ── Left: text ── */}
          <div className="flex-1 md:w-[42%] md:flex-none h-full flex flex-col relative z-10">
            {/* Mobile: progress dots */}
            <div className="md:hidden flex items-center gap-2 px-5 sm:px-6 pt-6">
              {SLIDES.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div
                    className="h-[2px] transition-all duration-500"
                    style={{
                      width: i === activeIndex ? "20px" : "10px",
                      backgroundColor: i <= activeIndex ? "var(--accent)" : "var(--text-subtle)",
                    }}
                  />
                  {i === activeIndex && (
                    <span className="text-[9px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {s.number}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Text slides */}
            <div className="flex-1 flex items-center relative">
              {SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 px-5 sm:px-8 md:px-10 lg:px-16 transition-all duration-700 ease-out"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    transform:
                      i === activeIndex
                        ? "translateY(0)"
                        : i < activeIndex
                        ? "translateY(-80px)"
                        : "translateY(80px)",
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  {/* Number — desktop */}
                  <span
                    className="hidden md:block font-heading text-[10px] tracking-[0.2em] mb-6"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {slide.number}
                  </span>

                  <h3
                    className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[1.05] mb-5 md:mb-8 max-w-md"
                    style={{ color: "var(--text)" }}
                  >
                    {slide.heading}
                  </h3>

                  <p
                    className="text-sm sm:text-base font-medium mb-4 md:mb-6 max-w-sm"
                    style={{ color: "var(--accent)" }}
                  >
                    {slide.highlight}
                  </p>

                  <p
                    className="text-xs sm:text-sm leading-relaxed max-w-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: image with convex bulge edge ── */}
          <div className="hidden md:block md:w-[58%] h-full relative">
            <ConvexImagePanel activeIndex={activeIndex} scrollProgress={scrollProgress} />
          </div>
        </div>

      </div>
    </section>
  );
}
