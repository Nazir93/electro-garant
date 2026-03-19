import { SITE_NAME, CITY, SITE_URL, PHONE_RAW, PHONE2_RAW } from "@/lib/constants";

interface LandingServiceSchemaProps {
  serviceName: string;
  serviceDescription: string;
  slug: string;
  priceRange?: string;
}

export function LandingServiceSchema({
  serviceName,
  serviceDescription,
  slug,
  priceRange = "от 50 000 ₽",
}: LandingServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: serviceDescription,
    provider: {
      "@type": "ElectricalContractor",
      name: SITE_NAME,
      telephone: [PHONE_RAW, PHONE2_RAW],
      url: SITE_URL,
      areaServed: {
        "@type": "City",
        name: CITY,
      },
    },
    areaServed: {
      "@type": "City",
      name: CITY,
    },
    url: `${SITE_URL}${slug}`,
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "RUB",
        price: priceRange,
      },
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Услуги",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: serviceName,
        item: `${SITE_URL}${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
