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
      { href: "/portfolio", label: "Портфолио" },
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
      { href: "/offer", label: "Рассчитать стоимость" },
    ],
  },
  {
    label: "Партнёрам",
    items: [
      { href: "/partners/supplier", label: "Стать поставщиком" },
      { href: "/partners/partner", label: "Стать партнёром" },
      { href: "/partners/vacancies", label: "Вакансии" },
      { href: "/partners/rent-repair", label: "Аренда и ремонт" },
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
