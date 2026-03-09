"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/lib/constants";

const SECTIONS = [
  {
    heading: "Полный цикл электромонтажных работ",
    description:
      "От проектирования и закупки оборудования до монтажа и пусконаладки. Мы берём на себя все этапы — вам не нужно координировать субподрядчиков.",
    highlight: "Собственный штат инженеров — без субподряда",
  },
  {
    heading: "Премиальные компоненты и оборудование",
    description:
      "Работаем только с проверенными брендами: ABB, Legrand, Schneider Electric, Hikvision. Прямые поставки от производителей без наценок посредников.",
    highlight: "Допуск СРО на все виды работ",
  },
  {
    heading: "Проектная документация по ГОСТ",
    description:
      "Однолинейные схемы, расчёт нагрузок, кабельный журнал, спецификации — передаём полный комплект документации. Вы всегда знаете, что у вас внутри стен.",
    highlight: "Гарантия 5 лет на работы и материалы",
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

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
      const idx = Math.min(
        Math.floor(progress * SECTIONS.length),
        SECTIONS.length - 1
      );
      setActiveIndex(idx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const progressPercent = ((activeIndex + 1) / SECTIONS.length) * 100;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative"
      style={{
        height: `${SECTIONS.length * 100}vh`,
        minHeight: `${SECTIONS.length * 100}vh`,
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="h-full flex">
          {/* Left side — text + progress line */}
          <div className="w-full md:w-[45%] h-full flex relative">
            {/* Vertical progress line */}
            <div
              className="hidden md:flex flex-col items-center gap-0 ml-6 lg:ml-10 pt-32 pb-20"
              style={{ width: "40px" }}
            >
              <div
                className="relative flex-1"
                style={{ width: "1px", backgroundColor: "var(--border)" }}
              >
                {/* Progress fill */}
                <div
                  className="absolute top-0 left-0 w-full transition-all duration-700 ease-out"
                  style={{
                    height: `${progressPercent}%`,
                    backgroundColor: "var(--text)",
                  }}
                />
                {/* Step numbers */}
                {SECTIONS.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-500"
                    style={{
                      top: `${((i + 0.5) / SECTIONS.length) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      className="text-[11px] font-heading transition-colors duration-500"
                      style={{
                        color:
                          i <= activeIndex
                            ? "var(--text)"
                            : "var(--text-subtle)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-16">
              {SECTIONS.map((section, i) => (
                <div
                  key={i}
                  className="absolute transition-all duration-700 ease-out px-6 md:px-10 lg:px-16"
                  style={{
                    top: "50%",
                    transform:
                      i === activeIndex
                        ? "translateY(-50%)"
                        : i < activeIndex
                        ? "translateY(-120%)"
                        : "translateY(80%)",
                    opacity: i === activeIndex ? 1 : 0,
                    maxWidth: "500px",
                  }}
                >
                  <h3
                    className="font-heading text-2xl md:text-3xl lg:text-4xl leading-[1.1] mb-6"
                    style={{ color: "var(--text)" }}
                  >
                    {section.heading}
                  </h3>

                  <p className="text-xs leading-relaxed tracking-wide mb-8" style={{ color: "var(--text-muted)" }}>
                    {/* Step indicator for mobile */}
                    <span className="md:hidden font-heading mr-2" style={{ color: "var(--text-subtle)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </p>

                  <p
                    className="text-sm md:text-base leading-relaxed mb-8"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {section.highlight}
                  </p>

                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — image placeholder with rounded corners */}
          <div className="hidden md:block w-[55%] h-full p-4 pl-0">
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "24px",
              }}
            >
              <span
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--text-subtle)" }}
              >
                Фото / Видео объекта
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 py-4 md:py-6 gap-y-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="px-3 md:px-4">
                  <div className="font-heading text-2xl sm:text-3xl md:text-4xl mb-1">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p
                    className="text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.15em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
