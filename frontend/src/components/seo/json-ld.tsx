import {
  SITE_NAME,
  CITY,
  SITE_URL,
  PHONE_RAW,
  PHONE2_RAW,
  EMAIL,
  ADDRESS,
} from "@/lib/constants";
import { prisma } from "@/lib/db";

async function getDbData() {
  try {
    const [reviews, faqs] = await Promise.all([
      prisma.review.findMany({ where: { visible: true }, orderBy: { order: "asc" }, take: 20 }),
      prisma.faq.findMany({ where: { visible: true }, orderBy: { order: "asc" }, take: 30 }),
    ]);
    return { reviews, faqs };
  } catch {
    return { reviews: [], faqs: [] };
  }
}

export async function JsonLd() {
  const { reviews, faqs } = await getDbData();

  const organization = {
    "@context": "https://schema.org",
    "@type": "ElectricalContractor",
    name: SITE_NAME,
    description: `Проектирование, поставка и монтаж электрики для ресторанов, офисов и квартир в ${CITY}. 280+ объектов. Гарантия 5 лет.`,
    url: SITE_URL,
    telephone: [PHONE_RAW, PHONE2_RAW],
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: CITY,
      addressCountry: "RU",
      streetAddress: ADDRESS,
    },
    areaServed: { "@type": "City", name: CITY },
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
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.authorName },
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
        reviewBody: r.text,
        ...(r.objectName && { itemReviewed: { "@type": "LocalBusiness", name: r.objectName } }),
      })),
    }),
  };

  const schemas: object[] = [organization];

  if (faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
