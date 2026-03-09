"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const ALL_POSTS = [
  {
    id: "1",
    title: "Как выбрать подрядчика для электромонтажа",
    excerpt:
      "Разбираем критерии оценки: допуск СРО, портфолио, гарантия, проектная документация. На что обратить внимание при выборе.",
    category: "Электромонтаж",
    date: "12.02.2026",
  },
  {
    id: "2",
    title: "Умный дом: KNX vs Z-Wave — что выбрать",
    excerpt:
      "Сравниваем два популярных протокола автоматизации. Плюсы, минусы, стоимость и сценарии использования для квартир и коммерции.",
    category: "Умный дом",
    date: "05.02.2026",
  },
  {
    id: "3",
    title: "5 ошибок при монтаже видеонаблюдения",
    excerpt:
      "Почему камеры не записывают ночью, архив заканчивается за 3 дня, и как избежать типичных проблем при установке системы безопасности.",
    category: "Безопасность",
    date: "28.01.2026",
  },
  {
    id: "4",
    title: "Акустика для ресторана: зонирование звука",
    excerpt:
      "Как сделать так, чтобы музыка создавала атмосферу, а не мешала гостям общаться. Мультизональные системы и архитектурная акустика.",
    category: "Акустика",
    date: "20.01.2026",
  },
  {
    id: "5",
    title: "Электрощит: от расчёта до сборки",
    excerpt:
      "Подробный гайд по проектированию и сборке электрощита для квартиры. Автоматы, УЗО, реле напряжения — что действительно нужно.",
    category: "Электромонтаж",
    date: "14.01.2026",
  },
  {
    id: "6",
    title: "СКС для офиса: инфраструктура на годы вперёд",
    excerpt:
      "Почему Cat 6A, а не Cat 5e. Как спроектировать серверную и обеспечить бесшовный Wi-Fi на весь офис.",
    category: "Слаботочка",
    date: "08.01.2026",
  },
  {
    id: "7",
    title: "Как мы автоматизировали ресторан на 400 м²",
    excerpt:
      "Кейс: мультизональный звук, диммируемое освещение, система вызова персонала и управление с iPad. Полный цикл за 14 дней.",
    category: "Кейсы",
    date: "25.12.2025",
  },
  {
    id: "8",
    title: "Освещение в квартире: сценарии и управление",
    excerpt:
      "Общий свет, рабочий, акцентный, ночной — разбираем, как спроектировать грамотное освещение и управлять им с телефона.",
    category: "Умный дом",
    date: "18.12.2025",
  },
  {
    id: "9",
    title: "Видеоаналитика: не просто запись, а инструмент",
    excerpt:
      "Подсчёт посетителей, детекция очередей, распознавание номеров — как современные камеры помогают бизнесу зарабатывать больше.",
    category: "Безопасность",
    date: "10.12.2025",
  },
];

function PostCard({
  post,
  index,
}: {
  post: (typeof ALL_POSTS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group cursor-pointer transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${(index % 3) * 100}ms`,
      }}
    >
      <div
        className="relative overflow-hidden flex flex-col justify-between h-[360px] p-6 md:p-8 transition-transform duration-500 group-hover:scale-[0.98]"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
        }}
      >
        {/* Image placeholder */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.03 }}
        >
          <span
            className="font-heading text-[160px] leading-none select-none"
            style={{ color: "var(--text)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Top: category + date + arrow */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              {post.category}
            </span>
            <span className="text-[10px] tracking-wider" style={{ color: "var(--text-subtle)" }}>
              {post.date}
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ border: "1px solid var(--border)" }}
          >
            <ArrowRight size={16} style={{ color: "var(--text)" }} />
          </div>
        </div>

        {/* Bottom: title + excerpt */}
        <div className="relative z-10">
          <h3
            className="font-heading text-xl md:text-2xl leading-[1.1] mb-3 transition-colors duration-200 group-hover:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            {post.title}
          </h3>
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
            {post.excerpt}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BlogPageContent() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto">
        {/* Title */}
        <h1
          className="font-heading text-[20vw] md:text-[14vw] lg:text-[12vw] leading-[0.85] tracking-tighter mb-6"
          style={{ color: "var(--text)" }}
        >
          БЛОГ
        </h1>
        <p className="text-base md:text-lg mb-14 md:mb-20 max-w-xl" style={{ color: "var(--text-muted)" }}>
          Полезные статьи, кейсы и новости из мира электромонтажа и автоматизации
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {ALL_POSTS.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
