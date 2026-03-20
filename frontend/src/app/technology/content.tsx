"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useModal } from "@/lib/modal-context";

const STAGES = [
  {
    number: "01",
    tag: "Старт",
    title: "Заявка и консультация",
    description: "Обсуждаем задачу, определяем объём работ, сроки и бюджет. Бесплатный выезд инженера на объект для первичной оценки.",
    details: [
      "Бесплатная консультация по телефону или на объекте",
      "Определение типа объекта и сложности работ",
      "Предварительная оценка стоимости и сроков",
      "Формирование коммерческого предложения",
    ],
  },
  {
    number: "02",
    tag: "Аналитика",
    title: "Обследование объекта",
    description: "Инженер выезжает на площадку: замеры, фиксация условий, фото, выявление ограничений и рисков.",
    details: [
      "Детальные замеры помещений и трасс",
      "Фотофиксация текущего состояния",
      "Анализ существующих инженерных коммуникаций",
      "Выявление рисков и ограничений объекта",
    ],
  },
  {
    number: "03",
    tag: "Документация",
    title: "Техническое задание",
    description: "Формируем детальное ТЗ с учётом нормативов, пожеланий заказчика и особенностей объекта.",
    details: [
      "Согласование требований с заказчиком",
      "Учёт нормативов ПУЭ, ГОСТ, СНиП",
      "Определение марок кабелей и оборудования",
      "Расчёт нагрузок и сечений проводников",
    ],
  },
  {
    number: "04",
    tag: "Проект",
    title: "Проектирование",
    description: "Однолинейные схемы, расчёт нагрузок, кабельный журнал — полный комплект проектной документации по ГОСТ.",
    details: [
      "Однолинейные схемы электроснабжения",
      "Планы расположения электрооборудования",
      "Кабельный журнал и спецификация материалов",
      "Расчёт токов короткого замыкания",
    ],
  },
  {
    number: "05",
    tag: "Согласование",
    title: "Согласование и утверждение",
    description: "Презентация решений заказчику. Согласование материалов, оборудования, сроков и этапов.",
    details: [
      "Презентация проектных решений заказчику",
      "Утверждение спецификации оборудования",
      "Фиксация сроков и этапов в договоре",
      "Определение графика финансирования",
    ],
  },
  {
    number: "06",
    tag: "Снабжение",
    title: "Закупка оборудования",
    description: "Прямые поставки от ABB, Legrand, Schneider Electric. Без наценок посредников, с гарантией производителя.",
    details: [
      "Прямые контракты с ABB, Legrand, Schneider Electric",
      "Входной контроль качества оборудования",
      "Логистика и складское хранение",
      "Гарантия производителя на все комплектующие",
    ],
  },
  {
    number: "07",
    tag: "Подготовка",
    title: "Подготовка площадки",
    description: "Разметка трасс, штробление, подготовка закладных. Защита чистовых поверхностей от повреждений.",
    details: [
      "Лазерная разметка трасс кабельных линий",
      "Штробление стен алмазным инструментом",
      "Установка закладных элементов и подрозетников",
      "Защита отделочных поверхностей",
    ],
  },
  {
    number: "08",
    tag: "Монтаж",
    title: "Черновой монтаж",
    description: "Прокладка магистральных кабелей, установка подрозетников, монтаж щитового оборудования.",
    details: [
      "Прокладка магистральных кабельных линий",
      "Монтаж распределительных щитов",
      "Установка модульного оборудования",
      "Маркировка линий и кабельных трасс",
    ],
  },
  {
    number: "09",
    tag: "Контроль",
    title: "Скрытые работы — фотофиксация",
    description: "Полная фотофиксация скрытых трасс до закрытия стен. Карта разводки для будущего обслуживания.",
    details: [
      "Фотофиксация каждой трассы до закрытия",
      "Составление карты скрытой разводки",
      "Акты на скрытые работы по форме",
      "Передача документации заказчику",
    ],
  },
  {
    number: "10",
    tag: "Финиш",
    title: "Чистовой монтаж",
    description: "Установка розеток, выключателей, светильников, панелей управления. Аккуратно, без повреждений отделки.",
    details: [
      "Установка электроустановочных изделий",
      "Монтаж светильников и LED-подсветки",
      "Подключение панелей управления умного дома",
      "Установка датчиков и контроллеров",
    ],
  },
  {
    number: "11",
    tag: "Тесты",
    title: "Пусконаладка и тестирование",
    description: "Проверка каждой линии, замер сопротивления изоляции, тестирование автоматики и сценариев.",
    details: [
      "Измерение сопротивления изоляции",
      "Проверка срабатывания автоматов защиты",
      "Тестирование сценариев освещения",
      "Протоколы измерений по ГОСТ",
    ],
  },
  {
    number: "12",
    tag: "Приёмка",
    title: "Сдача объекта",
    description: "Демонстрация работы систем заказчику. Передача исполнительной документации, актов и паспортов.",
    details: [
      "Демонстрация работы всех систем",
      "Передача полного пакета документации",
      "Инструктаж по эксплуатации оборудования",
      "Подписание акта приёмки-передачи",
    ],
  },
  {
    number: "13",
    tag: "Гарантия",
    title: "Гарантия и поддержка",
    description: "2 года гарантии на все работы. Техническая поддержка 24/7, оперативный выезд при необходимости.",
    details: [
      "2 года гарантии на все выполненные работы",
      "Техническая поддержка 24/7",
      "Оперативный выезд при аварийных ситуациях",
      "Планово-профилактическое обслуживание",
    ],
  },
];

export default function TechnologyContent() {
  const { openModal } = useModal();
  const [openStage, setOpenStage] = useState<number | null>(0);

  return (
    <main style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <section className="pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 px-5 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] mb-8 transition-colors duration-300 hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} />
            На главную
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[1px]" style={{ backgroundColor: "var(--accent)" }} />
            <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>
              Собственная технология
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight mb-6">
            Технология
            <br />
            <span style={{ color: "var(--accent)" }}>монтажа</span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: "var(--text-muted)" }}>
            13 этапов от заявки до гарантийного обслуживания. Каждый шаг
            задокументирован, стандартизирован и отработан на 280+ объектах.
            Мы не импровизируем — мы следуем системе.
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-28 md:pb-36 px-5 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col">
            {STAGES.map((stage, i) => {
              const isOpen = openStage === i;
              return (
                <div
                  key={i}
                  className="border-t transition-colors duration-300"
                  style={{ borderColor: "var(--border)" }}
                >
                  <button
                    onClick={() => setOpenStage(isOpen ? null : i)}
                    className="w-full flex items-start sm:items-center gap-4 sm:gap-6 py-6 sm:py-8 text-left group"
                  >
                    <span
                      className="font-heading text-2xl sm:text-3xl md:text-4xl tabular-nums shrink-0 w-12 sm:w-16"
                      style={{ color: isOpen ? "var(--accent)" : "var(--text-subtle)" }}
                    >
                      {stage.number}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className="text-[9px] uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border"
                          style={{
                            color: "var(--accent)",
                            borderColor: "rgba(201,168,76,0.2)",
                            backgroundColor: "rgba(201,168,76,0.05)",
                          }}
                        >
                          {stage.tag}
                        </span>
                      </div>
                      <h3
                        className="font-heading text-base sm:text-lg md:text-xl leading-tight transition-colors duration-300 group-hover:text-[var(--accent)]"
                        style={{ color: isOpen ? "var(--accent)" : "var(--text)" }}
                      >
                        {stage.title}
                      </h3>
                    </div>

                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300"
                      style={{
                        borderColor: isOpen ? "var(--accent)" : "var(--border)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                      }}
                    >
                      <span className="text-lg leading-none" style={{ color: isOpen ? "var(--accent)" : "var(--text-muted)" }}>+</span>
                    </div>
                  </button>

                  <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                      maxHeight: isOpen ? "400px" : "0",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="pl-16 sm:pl-22 pb-8 sm:pb-10">
                      <p className="text-sm leading-relaxed mb-5 max-w-lg" style={{ color: "var(--text-muted)" }}>
                        {stage.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stage.details.map((detail, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <CheckCircle size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                            <span className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                              {detail}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="border-t" style={{ borderColor: "var(--border)" }} />
          </div>

          <div className="mt-16 sm:mt-20 text-center">
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Хотите узнать стоимость электромонтажа для вашего объекта?
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border transition-all duration-500 hover:bg-[rgba(201,168,76,0.1)]"
              style={{ borderColor: "rgba(201,168,76,0.4)" }}
            >
              <span className="text-sm font-heading uppercase tracking-[0.12em]" style={{ color: "var(--text)" }}>
                Рассчитать стоимость
              </span>
              <ArrowRight size={16} style={{ color: "var(--accent)" }} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
