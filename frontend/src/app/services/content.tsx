import Link from "next/link";
import Image from "next/image";
import type { ServiceItem } from "@/lib/get-services";
import { resolveServiceCardMedia } from "@/lib/service-card-media";
import { SITE_NAME } from "@/lib/constants";
import { formatArticleBody } from "@/lib/html-content";

function ServiceCard({ service }: { service: ServiceItem }) {
  const media = resolveServiceCardMedia(service);
  const href = service.slug.startsWith("/") ? service.slug : `/services/${service.slug}`;

  return (
    <li>
      <Link
        href={href}
        aria-label={`${service.title} — подробнее об услуге`}
        className="group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] transition-colors hover:border-[var(--accent)]"
      >
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--bg-secondary)]">
          {media.videoUrl ? (
            <video
              src={media.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              aria-hidden
            />
          ) : media.coverImage ? (
            <Image
              src={media.coverImage}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={media.coverImage.startsWith("/uploads/")}
              aria-hidden
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: "var(--text-subtle)" }}>
              Нет фото
            </span>
          )}
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/25 to-transparent"
            aria-hidden
          />
          <h2 className="absolute bottom-0 left-0 right-0 z-[2] line-clamp-2 px-3 pb-2.5 pt-10 font-heading text-xs font-semibold leading-snug tracking-tight text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.85)] sm:text-sm md:px-4 md:pb-3 group-hover:text-[var(--accent)]">
            {service.title}
          </h2>
        </div>
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <p className="flex-1 text-sm leading-relaxed text-[var(--text-muted)]">{service.shortDescription}</p>
          <span className="mt-3 text-xs font-medium uppercase tracking-wide text-[var(--text-subtle)] group-hover:text-[var(--accent)]">
            Подробнее
          </span>
        </div>
      </Link>
    </li>
  );
}

export function ServicesPageContent({
  services,
  pageH1,
  introText,
  bannerUrl,
  bodyHtml,
}: {
  services: ServiceItem[];
  pageH1: string;
  introText: string;
  bannerUrl: string | null;
  bodyHtml: string | null;
}) {
  const bannerAlt = `${pageH1} — ${SITE_NAME}`;

  return (
    <section className="pt-20 pb-12 md:pt-24 md:pb-16" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto max-w-5xl">
        {bannerUrl ? (
          <figure className="mb-6 md:mb-8">
            <div className="relative aspect-[2/1] w-full max-h-[min(42vh,380px)] overflow-hidden rounded-md border bg-[var(--bg-secondary)] md:aspect-[21/9]">
              <Image
                src={bannerUrl}
                alt={bannerAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, min(1024px, 100vw)"
                priority
                unoptimized={bannerUrl.startsWith("/uploads/")}
              />
            </div>
          </figure>
        ) : null}

        <h1 className="font-heading text-xl font-semibold tracking-tight text-[var(--text)] sm:text-2xl md:text-[1.65rem]">
          {pageH1}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
          {introText}
        </p>

        {bodyHtml ? (
          <div
            className="prose prose-sm md:prose-base max-w-none mt-8 md:mt-10 [&_img]:rounded-md [&_img]:border [&_img]:border-[var(--border)]"
            style={{ color: "var(--text)" }}
            dangerouslySetInnerHTML={{ __html: formatArticleBody(bodyHtml) }}
          />
        ) : null}

        <ul className="mt-8 grid list-none gap-4 md:mt-10 md:grid-cols-2 md:gap-5">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ul>
      </div>
    </section>
  );
}
