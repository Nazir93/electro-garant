"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Заявка и консультация",
    description: "Обсуждаем задачу, определяем объём работ, сроки и бюджет. Бесплатный выезд инженера на объект.",
    tag: "Старт",
  },
  {
    number: "02",
    title: "Обследование объекта",
    description: "Инженер выезжает на площадку: замеры, фиксация условий, фото, выявление ограничений и рисков.",
    tag: "Аналитика",
  },
  {
    number: "03",
    title: "Техническое задание",
    description: "Формируем детальное ТЗ с учётом нормативов, пожеланий заказчика и особенностей объекта.",
    tag: "Документация",
  },
  {
    number: "04",
    title: "Проектирование",
    description: "Однолинейные схемы, расчёт нагрузок, кабельный журнал — полный комплект проектной документации по ГОСТ.",
    tag: "Проект",
  },
  {
    number: "05",
    title: "Согласование и утверждение",
    description: "Презентация решений заказчику. Согласование материалов, оборудования, сроков и этапов.",
    tag: "Согласование",
  },
  {
    number: "06",
    title: "Закупка оборудования",
    description: "Прямые поставки от ABB, Legrand, Schneider Electric. Без наценок посредников, с гарантией производителя.",
    tag: "Снабжение",
  },
  {
    number: "07",
    title: "Подготовка площадки",
    description: "Разметка трасс, штробление, подготовка закладных. Защита чистовых поверхностей от повреждений.",
    tag: "Подготовка",
  },
  {
    number: "08",
    title: "Черновой монтаж",
    description: "Прокладка магистральных кабелей, установка подрозетников, монтаж щитового оборудования.",
    tag: "Монтаж",
  },
  {
    number: "09",
    title: "Скрытые работы — фотофиксация",
    description: "Полная фотофиксация скрытых трасс до закрытия стен. Карта разводки для будущего обслуживания.",
    tag: "Контроль",
  },
  {
    number: "10",
    title: "Чистовой монтаж",
    description: "Установка розеток, выключателей, светильников, панелей управления. Аккуратно, без повреждений отделки.",
    tag: "Финиш",
  },
  {
    number: "11",
    title: "Пусконаладка и тестирование",
    description: "Проверка каждой линии, замер сопротивления изоляции, тестирование автоматики и сценариев.",
    tag: "Тесты",
  },
  {
    number: "12",
    title: "Сдача объекта",
    description: "Демонстрация работы систем заказчику. Передача исполнительной документации, актов и паспортов.",
    tag: "Приёмка",
  },
  {
    number: "13",
    title: "Гарантия и поддержка",
    description: "2 года гарантии на все работы. Техническая поддержка 24/7, оперативный выезд при необходимости.",
    tag: "Гарантия",
  },
];

export function TechnologySection() {
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
      const p = Math.max(0, Math.min(scrolled / scrollRange, 1));
      setActiveIndex(Math.min(Math.floor(p * STEPS.length), STEPS.length - 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        height: `${STEPS.length * 45 + 80}vh`,
        backgroundColor: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">

          {/* ── Left: step content ── */}
          <div className="flex-1 md:w-[45%] md:flex-none h-full flex flex-col relative z-10">

            {/* Top bar: title + progress */}
            <div className="px-5 sm:px-8 md:px-10 lg:px-16 pt-6 sm:pt-8 md:pt-10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2
                  className="font-heading text-lg sm:text-xl md:text-2xl"
                  style={{ color: "var(--text)" }}
                >
                  Технология монтажа
                </h2>
                <span
                  className="text-[10px] sm:text-xs tabular-nums font-heading"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {String(activeIndex + 1).padStart(2, "0")} / {STEPS.length}
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="h-[2px] w-full rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${((activeIndex + 1) / STEPS.length) * 100}%`,
                    backgroundColor: "var(--accent)",
                  }}
                />
              </div>
            </div>

            {/* Step slides */}
            <div className="flex-1 flex items-center relative">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 px-5 sm:px-8 md:px-10 lg:px-16 transition-all duration-600 ease-out"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    transform:
                      i === activeIndex
                        ? "translateY(0)"
                        : i < activeIndex
                        ? "translateY(-60px)"
                        : "translateY(60px)",
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  {/* Tag */}
                  <span
                    className="inline-block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-5 sm:mb-6 border"
                    style={{
                      color: "var(--accent)",
                      borderColor: "rgba(201,168,76,0.2)",
                      backgroundColor: "rgba(201,168,76,0.05)",
                    }}
                  >
                    {step.tag}
                  </span>

                  {/* Number */}
                  <div
                    className="font-heading text-6xl sm:text-7xl md:text-8xl leading-none mb-3 sm:mb-4"
                    style={{ color: "var(--text)", opacity: 0.08 }}
                  >
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3
                    className="font-heading text-xl sm:text-2xl md:text-3xl leading-[1.1] mb-4 sm:mb-6 max-w-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-xs sm:text-sm leading-relaxed max-w-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom: mini step indicators (mobile) */}
            <div className="md:hidden px-5 sm:px-6 pb-4 flex items-center gap-1 overflow-x-auto">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 h-[3px] rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? "16px" : "6px",
                    backgroundColor: i <= activeIndex ? "var(--accent)" : "var(--border)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Right: visual panel ── */}
          <div className="hidden md:flex md:w-[55%] h-full flex-col relative">

            {/* Step list — vertical timeline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-md px-8">

                {/* Vertical line */}
                <div
                  className="absolute left-[22px] top-0 bottom-0 w-[1px]"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <div
                    className="w-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      height: `${((activeIndex + 1) / STEPS.length) * 100}%`,
                      backgroundColor: "var(--accent)",
                    }}
                  />
                </div>

                {/* Step dots + labels */}
                <div className="flex flex-col gap-[2px]">
                  {STEPS.map((step, i) => {
                    const isPast = i < activeIndex;
                    const isCurrent = i === activeIndex;

                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 py-[6px] transition-all duration-400"
                        style={{
                          opacity: isCurrent ? 1 : isPast ? 0.5 : 0.2,
                          transform: isCurrent ? "translateX(8px)" : "translateX(0)",
                        }}
                      >
                        {/* Dot */}
                        <div
                          className="relative shrink-0 w-[10px] h-[10px] rounded-full z-10 transition-all duration-400"
                          style={{
                            backgroundColor: isCurrent
                              ? "var(--accent)"
                              : isPast
                              ? "var(--accent)"
                              : "var(--border)",
                            boxShadow: isCurrent
                              ? "0 0 12px rgba(201,168,76,0.4)"
                              : "none",
                            transform: isCurrent ? "scale(1.4)" : "scale(1)",
                          }}
                        />

                        {/* Label */}
                        <div className="flex items-baseline gap-2 min-w-0">
                          <span
                            className="text-[10px] tabular-nums font-heading shrink-0"
                            style={{
                              color: isCurrent ? "var(--accent)" : "var(--text-subtle)",
                            }}
                          >
                            {step.number}
                          </span>
                          <span
                            className="text-xs truncate transition-colors duration-300"
                            style={{
                              color: isCurrent
                                ? "var(--text)"
                                : isPast
                                ? "var(--text-muted)"
                                : "var(--text-subtle)",
                              fontWeight: isCurrent ? 600 : 400,
                            }}
                          >
                            {step.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Background grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
