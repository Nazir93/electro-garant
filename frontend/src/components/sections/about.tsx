"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useModal } from "@/lib/modal-context";
import { useThrottledScroll } from "@/lib/use-throttled-scroll";

type SlideAction =
  | { type: "link"; href: string; label: string }
  | { type: "modal"; label: string };

interface Slide {
  number: string;
  heading: string;
  highlight: string;
  description: string;
  imageLabel: string;
  action: SlideAction;
}

const SLIDES: Slide[] = [
  {
    number: "01",
    heading: "Собственная технология монтажа",
    highlight: "Авторская методика, отточенная на 280+ объектах",
    description:
      "Мы разработали собственную технологию электромонтажа, которая сокращает сроки работ на 30% без потери качества. Каждый этап документирован и стандартизирован — от разметки трасс до пусконаладки.",
    imageLabel: "Фото — процесс монтажа",
    action: { type: "link", href: "/technology", label: "Узнать подробнее" },
  },
  {
    number: "02",
    heading: "Соблюдение нормативной документации",
    highlight: "Полное соответствие ГОСТ, ПУЭ и СНиП",
    description:
      "Каждый проект проходит многоступенчатую проверку на соответствие действующим нормативам. Исполнительная документация, акты скрытых работ и протоколы измерений — неотъемлемая часть нашей работы.",
    imageLabel: "Фото — документация и проект",
    action: { type: "modal", label: "Рассчитать стоимость" },
  },
  {
    number: "03",
    heading: "Соблюдение сроков — наш приоритет",
    highlight: "98% объектов сданы точно в срок",
    description:
      "Фиксированные сроки в договоре — не формальность, а принцип работы. Собственный штат инженеров и система управления проектами позволяют контролировать каждый этап без задержек.",
    imageLabel: "Фото — координация на объекте",
    action: { type: "modal", label: "Рассчитать стоимость" },
  },
  {
    number: "04",
    heading: "Большой комплекс монтажных работ",
    highlight: "От слаботочных систем до силовых сетей",
    description:
      "Электромонтаж, коммерческая акустика, видеонаблюдение, умный дом, слаботочные системы — один подрядчик на все виды работ. Единая ответственность и слаженная команда.",
    imageLabel: "Фото — щитовое оборудование",
    action: { type: "link", href: "/services", label: "Все услуги" },
  },
  {
    number: "05",
    heading: "Следим за репутацией — 13 лет на рынке",
    highlight: "Нам доверяют Radisson, Роза Хутор, Papa John's",
    description:
      "За 13 лет мы выполнили проекты для крупнейших сетей и частных заказчиков по всему югу России. Каждый объект — подтверждение компетенции и надёжности нашей команды.",
    imageLabel: "Фото — готовый объект",
    action: { type: "link", href: "/portfolio", label: "Портфолио" },
  },
  {
    number: "06",
    heading: "Работаем по всему Югу и в Москве",
    highlight: "Сочи • Новороссийск • Краснодар • Ростов • Москва",
    description:
      "География наших проектов охватывает весь юг России и столицу. Выезд инженера и обследование объекта — бесплатно в любом из городов присутствия.",
    imageLabel: "Фото — география проектов",
    action: { type: "modal", label: "Рассчитать стоимость" },
  },
  {
    number: "07",
    heading: "Гарантия и поддержка",
    highlight: "2 года гарантия + техническая поддержка 24/7",
    description:
      "Полная ответственность за каждый выполненный объект. Проектная документация по ГОСТ, сопровождение после сдачи — мы всегда на связи.",
    imageLabel: "Фото — обслуживание",
    action: { type: "link", href: "/contacts", label: "Связаться с нами" },
  },
];

function ImagePanel({ activeIndex, scrollProgress }: { activeIndex: number; scrollProgress: number }) {
  const { openModal } = useModal();

  const stripY = scrollProgress * 100;

  return (
    <div className="h-full relative overflow-hidden">
      {/* Vertical strip with brand name sliding down */}
      <div
        className="absolute left-0 top-0 bottom-0 z-20 flex items-start"
        style={{ width: "40px" }}
      >
        <div
          className="absolute left-0 w-full flex items-center justify-center transition-transform duration-100 ease-linear"
          style={{
            height: "100%",
            transform: `translateY(0)`,
          }}
        >
          <div
            className="whitespace-nowrap font-heading text-[10px] uppercase tracking-[0.3em] select-none"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              color: "rgba(201,168,76,0.5)",
              transform: `translateY(${stripY - 50}%)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            ГАРАНТ МОНТАЖ • ЭЛЕКТРОМОНТАЖ ПРЕМИУМ-КЛАССА • ГАРАНТ МОНТАЖ • ЭЛЕКТРОМОНТАЖ ПРЕМИУМ-КЛАССА
          </div>
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--bg) 0%, transparent 15%, transparent 85%, var(--bg) 100%)",
            pointerEvents: "none",
          }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-[1px]" style={{ backgroundColor: "var(--border)" }} />
      </div>

      <div className="relative w-full h-full" style={{ paddingLeft: "40px" }}>
      {SLIDES.map((slide, i) => (
        <div
          key={slide.number}
          className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-700"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            backgroundColor: "#0A0A0A",
            pointerEvents: i === activeIndex ? "auto" : "none",
          }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.2em] mb-8"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {slide.imageLabel}
          </span>

          {slide.action.type === "link" ? (
            <Link
              href={slide.action.href}
              className="group flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-500 hover:bg-[rgba(201,168,76,0.15)]"
              style={{ borderColor: "rgba(201,168,76,0.4)" }}
            >
              <span
                className="text-xs uppercase tracking-[0.12em] font-heading transition-colors duration-300 group-hover:text-[var(--accent)]"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {slide.action.label}
              </span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: "rgba(201,168,76,0.8)" }} />
            </Link>
          ) : (
            <button
              onClick={openModal}
              className="group flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-500 hover:bg-[rgba(201,168,76,0.15)]"
              style={{ borderColor: "rgba(201,168,76,0.4)" }}
            >
              <span
                className="text-xs uppercase tracking-[0.12em] font-heading transition-colors duration-300 group-hover:text-[var(--accent)]"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {slide.action.label}
              </span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: "rgba(201,168,76,0.8)" }} />
            </button>
          )}
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

  const handleScroll = useCallback(() => {
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
  }, []);

  useThrottledScroll(handleScroll, 32);

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

          {/* Left: text */}
          <div className="flex-1 md:w-[42%] md:flex-none h-full flex flex-col relative z-10">
            {/* Mobile progress dots */}
            <div className="md:hidden flex items-center gap-2 px-5 sm:px-6 pt-28">
              {SLIDES.map((s, i) => (
                <div key={s.number} className="flex items-center gap-1.5">
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

            {/* Desktop slide counter */}
            <div className="hidden md:flex items-center gap-3 px-10 lg:px-16 pt-16 md:pt-20">
              <span className="text-[10px] font-heading tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
                {String(activeIndex + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
              </span>
              <div className="flex-1 h-[1px] max-w-[120px]" style={{ backgroundColor: "var(--border)" }}>
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((activeIndex + 1) / SLIDES.length) * 100}%`,
                    backgroundColor: "var(--accent)",
                  }}
                />
              </div>
            </div>

            {/* Background large number */}
            <div className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden">
              {SLIDES.map((slide, i) => (
                <div
                  key={`bg-${slide.number}`}
                  className="absolute inset-0 flex items-center transition-opacity duration-700"
                  style={{ opacity: i === activeIndex ? 1 : 0 }}
                >
                  <span
                    className="font-heading text-[30vw] md:text-[20vw] leading-none pl-4 md:pl-8"
                    style={{ color: "var(--text)", opacity: 0.04 }}
                  >
                    {slide.number}
                  </span>
                </div>
              ))}
            </div>

            {/* Text slides */}
            <div className="flex-1 flex items-center relative">
              {SLIDES.map((slide, i) => (
                <div
                  key={`text-${slide.number}`}
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

                  {/* Mobile CTA */}
                  <div className="md:hidden mt-6">
                    {slide.action.type === "link" ? (
                      <Link
                        href={slide.action.href}
                        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-heading transition-colors duration-300"
                        style={{ color: "var(--accent)" }}
                      >
                        {slide.action.label}
                        <ArrowRight size={14} />
                      </Link>
                    ) : (
                      <MobileCTA label={slide.action.label} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image panel — rectangular border */}
          <div className="hidden md:block md:w-[58%] h-full relative">
            <ImagePanel activeIndex={activeIndex} scrollProgress={scrollProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileCTA({ label }: { label: string }) {
  const { openModal } = useModal();
  return (
    <button
      onClick={openModal}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] font-heading transition-colors duration-300"
      style={{ color: "var(--accent)" }}
    >
      {label}
      <ArrowRight size={14} />
    </button>
  );
}
