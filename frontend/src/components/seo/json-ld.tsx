import {
  SITE_NAME,
  CITY,
  SITE_URL,
  PHONE_RAW,
  EMAIL,
  ADDRESS,
} from "@/lib/constants";

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ElectricalContractor",
    name: SITE_NAME,
    description: `Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир в ${CITY}. 280+ объектов. Гарантия 5 лет.`,
    url: SITE_URL,
    telephone: PHONE_RAW,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: CITY,
      addressCountry: "RU",
      streetAddress: ADDRESS,
    },
    areaServed: {
      "@type": "City",
      name: CITY,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги электромонтажа",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Коммерческая акустика" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Электромонтажные работы" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Слаботочные системы (СКС)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Умный дом" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Видеонаблюдение и безопасность" } },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
