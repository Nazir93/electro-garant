"use client";

import { useState } from "react";
import { ArrowRight, Download, ChevronDown } from "lucide-react";
import { SITE_NAME, PHONE, PHONE_RAW } from "@/lib/constants";
import { useModal } from "@/lib/modal-context";

interface PriceItem {
  name: string;
  unit: string;
  price: string;
}

interface PriceCategory {
  id: string;
  title: string;
  items: PriceItem[];
}

const PRICE_DATA: PriceCategory[] = [
  {
    id: "electrical",
    title: "Электромонтажные работы",
    items: [
      { name: "Монтаж электрощита (до 24 модулей)", unit: "шт", price: "от 8 000" },
      { name: "Монтаж электрощита (до 54 модулей)", unit: "шт", price: "от 15 000" },
      { name: "Прокладка кабеля в штробе", unit: "м.п.", price: "от 150" },
      { name: "Прокладка кабеля в гофре / кабель-канале", unit: "м.п.", price: "от 100" },
      { name: "Установка розетки / выключателя", unit: "шт", price: "от 350" },
      { name: "Установка светильника (точечный)", unit: "шт", price: "от 450" },
      { name: "Установка люстры", unit: "шт", price: "от 1 200" },
      { name: "Штробление стен (бетон)", unit: "м.п.", price: "от 500" },
      { name: "Штробление стен (кирпич / гипс)", unit: "м.п.", price: "от 300" },
      { name: "Сборка и подключение щита", unit: "шт", price: "от 12 000" },
      { name: "Монтаж контура заземления", unit: "шт", price: "от 18 000" },
    ],
  },
  {
    id: "cabling",
    title: "Слаботочные системы (СКС)",
    items: [
      { name: "Прокладка UTP-кабеля (Cat 5e / 6)", unit: "м.п.", price: "от 80" },
      { name: "Монтаж сетевой розетки RJ-45", unit: "шт", price: "от 400" },
      { name: "Монтаж патч-панели (24 порта)", unit: "шт", price: "от 3 500" },
      { name: "Установка и настройка коммутатора", unit: "шт", price: "от 2 000" },
      { name: "Монтаж серверного шкафа", unit: "шт", price: "от 5 000" },
      { name: "Прокладка оптического кабеля", unit: "м.п.", price: "от 200" },
      { name: "Сварка оптоволокна (одно соединение)", unit: "шт", price: "от 600" },
    ],
  },
  {
    id: "security",
    title: "Видеонаблюдение и безопасность",
    items: [
      { name: "Установка IP-камеры (внутренняя)", unit: "шт", price: "от 2 500" },
      { name: "Установка IP-камеры (уличная)", unit: "шт", price: "от 3 500" },
      { name: "Монтаж видеорегистратора / NVR", unit: "шт", price: "от 3 000" },
      { name: "Настройка удалённого доступа", unit: "шт", price: "от 2 000" },
      { name: "Монтаж системы контроля доступа (СКУД)", unit: "точка", price: "от 8 000" },
      { name: "Установка домофона / видеодомофона", unit: "шт", price: "от 4 000" },
      { name: "Монтаж охранной сигнализации", unit: "зона", price: "от 2 500" },
    ],
  },
  {
    id: "smart",
    title: "Умный дом",
    items: [
      { name: "Проектирование системы автоматизации", unit: "проект", price: "от 25 000" },
      { name: "Монтаж контроллера умного дома", unit: "шт", price: "от 5 000" },
      { name: "Автоматизация освещения (1 группа)", unit: "шт", price: "от 3 500" },
      { name: "Автоматизация штор / жалюзи", unit: "шт", price: "от 6 000" },
      { name: "Интеграция мультирум (1 зона)", unit: "зона", price: "от 15 000" },
      { name: "Установка сенсорной панели управления", unit: "шт", price: "от 8 000" },
      { name: "Настройка сценариев и автоматизаций", unit: "час", price: "от 3 000" },
    ],
  },
  {
    id: "acoustics",
    title: "Коммерческая акустика",
    items: [
      { name: "Проектирование звуковой системы", unit: "проект", price: "от 15 000" },
      { name: "Установка потолочного динамика", unit: "шт", price: "от 2 000" },
      { name: "Установка настенного динамика", unit: "шт", price: "от 2 500" },
      { name: "Монтаж усилителя / микшера", unit: "шт", price: "от 3 000" },
      { name: "Прокладка акустического кабеля", unit: "м.п.", price: "от 80" },
      { name: "Настройка и калибровка системы", unit: "зона", price: "от 5 000" },
    ],
  },
  {
    id: "project",
    title: "Проектирование",
    items: [
      { name: "Проект электроснабжения (квартира до 100 м²)", unit: "проект", price: "от 25 000" },
      { name: "Проект электроснабжения (квартира 100–200 м²)", unit: "проект", price: "от 40 000" },
      { name: "Проект электроснабжения (коммерция)", unit: "проект", price: "от 60 000" },
      { name: "Проект слаботочных систем", unit: "проект", price: "от 20 000" },
      { name: "Проект видеонаблюдения", unit: "проект", price: "от 15 000" },
      { name: "Авторский надзор", unit: "выезд", price: "от 5 000" },
    ],
  },
];

function CategoryTable({ category, isOpen, onToggle }: {
  category: PriceCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="border-b transition-colors"
      style={{ borderColor: "var(--border)" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 sm:py-6 px-4 sm:px-6 text-left group"
      >
        <div className="flex items-center gap-3 sm:gap-5">
          <span
            className="font-heading text-2xl sm:text-3xl md:text-4xl tabular-nums"
            style={{ color: isOpen ? "var(--accent)" : "var(--text-subtle)" }}
          >
            {String(PRICE_DATA.indexOf(category) + 1).padStart(2, "0")}
          </span>
          <span
            className="font-heading text-sm sm:text-base md:text-lg transition-colors"
            style={{ color: isOpen ? "var(--text)" : "var(--text-muted)" }}
          >
            {category.title}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span
            className="text-[10px] sm:text-xs tabular-nums"
            style={{ color: "var(--text-subtle)" }}
          >
            {category.items.length} позиций
          </span>
          <ChevronDown
            size={18}
            className="transition-transform duration-300"
            style={{
              color: "var(--text-muted)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? `${category.items.length * 60 + 40}px` : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-4 sm:px-6 pb-6">
          {/* Table header */}
          <div
            className="hidden sm:grid grid-cols-[1fr_80px_120px] gap-4 pb-3 mb-2 border-b text-[10px] uppercase tracking-[0.15em]"
            style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          >
            <span>Наименование</span>
            <span className="text-center">Ед.</span>
            <span className="text-right">Цена, ₽</span>
          </div>

          {/* Table rows */}
          {category.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px] gap-1 sm:gap-4 py-2.5 sm:py-3 border-b last:border-b-0 items-center"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-xs sm:text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {item.name}
              </span>
              <div className="flex sm:block items-center gap-2">
                <span
                  className="sm:hidden text-[10px] uppercase"
                  style={{ color: "var(--text-subtle)" }}
                >
                  Ед:
                </span>
                <span
                  className="text-[11px] sm:text-xs text-center sm:block"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {item.unit}
                </span>
              </div>
              <span
                className="text-sm sm:text-base font-heading sm:text-right"
                style={{ color: "var(--text)" }}
              >
                {item.price} ₽
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricePageContent() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set([PRICE_DATA[0].id])
  );
  const { openModal } = useModal();

  const toggle = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* Hero */}
      <section className="pt-10 sm:pt-14 md:pt-20 pb-10 sm:pb-14 md:pb-20">
        <div className="container mx-auto">
          <p
            className="text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6"
            style={{ color: "var(--text-subtle)" }}
          >
            {SITE_NAME} / Прайс-лист
          </p>
          <h1
            className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tight mb-5 sm:mb-8"
          >
            ПРАЙС-ЛИСТ
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Ориентировочные цены на электромонтажные работы. Точная стоимость
            рассчитывается после выезда инженера и зависит от сложности объекта,
            типа помещения и объёма работ.
          </p>
        </div>
      </section>

      {/* Price table */}
      <section className="pb-10 sm:pb-16 md:pb-24">
        <div className="container mx-auto">
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: "var(--border)" }}
          >
            {PRICE_DATA.map((category) => (
              <CategoryTable
                key={category.id}
                category={category}
                isOpen={openCategories.has(category.id)}
                onToggle={() => toggle(category.id)}
              />
            ))}
          </div>

          {/* Note */}
          <p
            className="mt-6 sm:mt-8 text-[11px] sm:text-xs leading-relaxed max-w-2xl"
            style={{ color: "var(--text-subtle)" }}
          >
            * Указаны ориентировочные цены. Окончательная стоимость определяется
            после осмотра объекта и составления сметы. Минимальный заказ — 30 000 ₽.
            Выезд инженера для замеров — бесплатно.
          </p>
        </div>
      </section>

      {/* Download + CTA */}
      <section
        className="border-t py-12 sm:py-16 md:py-20"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2
                className="font-heading text-xl sm:text-2xl md:text-3xl mb-3"
              >
                Скачайте полный прайс-лист
              </h2>
              <p
                className="text-xs sm:text-sm max-w-md"
                style={{ color: "var(--text-muted)" }}
              >
                PDF-документ с актуальными ценами на все виды работ,
                материалы и оборудование
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
              <a
                href="/price-list.pdf"
                download
                className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-heading text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] min-h-[48px]"
                style={{
                  backgroundColor: "var(--text)",
                  color: "var(--bg)",
                }}
              >
                <Download size={16} />
                Скачать PDF
              </a>

              <button
                onClick={openModal}
                className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-heading text-sm sm:text-base border transition-all duration-300 hover:scale-[1.02] min-h-[48px]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                Рассчитать стоимость
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Contact hint */}
          <div
            className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Нужна индивидуальная смета?
            </p>
            <a
              href={`tel:${PHONE_RAW}`}
              className="font-heading text-lg sm:text-xl transition-colors hover:opacity-80"
              style={{ color: "var(--text)" }}
            >
              {PHONE}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
