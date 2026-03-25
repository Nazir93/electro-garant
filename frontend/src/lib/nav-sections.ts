/** Пункт меню: ссылка или открытие модалки */
export type NavLeaf =
  | { label: string; href: string }
  | { label: string; action: "openModal" };

/** Группа с подпунктами (напр. «Услуги» → прайс, документы…) */
export type NavGroup = { label: string; children: NavLeaf[] };

export type NavItem = NavLeaf | NavGroup;

export type NavSection = { label: string; items: NavItem[] };

export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item && Array.isArray((item as NavGroup).children);
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "О нас",
    items: [
      { href: "/technology", label: "Технология монтажа" },
      { href: "/#about", label: "Наша история" },
      { href: "/portfolio", label: "Портфолио" },
      { href: "/contacts", label: "Приложение" },
      { href: "/contacts", label: "Контакты" },
    ],
  },
  {
    label: "Заказчикам",
    items: [
      {
        label: "Услуги",
        children: [
          { href: "/services", label: "Все услуги" },
          { href: "/services/electrical", label: "Электромонтаж" },
          { href: "/services/acoustics", label: "Акустика" },
          { href: "/services/smart-home", label: "Умный дом" },
          { href: "/services/security", label: "Безопасность" },
          { href: "/services/structured-cabling", label: "Слаботочные" },
        ],
      },
      { href: "/price", label: "Прайслист" },
      { href: "/portfolio", label: "Референс лист" },
      { href: "/technology", label: "Документация" },
      { label: "Рассчитать стоимость", action: "openModal" },
    ],
  },
  {
    label: "Партнёрам",
    items: [
      { href: "/#partners", label: "Стать поставщиком" },
      { href: "/#partners", label: "Стать подрядчиком" },
      { href: "/contacts", label: "Вакансии" },
      { href: "/contacts", label: "Аренда и ремонт" },
      { href: "/contacts", label: "Тех поддержка" },
    ],
  },
  {
    label: "Информация",
    items: [
      { href: "/blog", label: "Блог" },
      { href: "/forum", label: "Форум" },
    ],
  },
];
