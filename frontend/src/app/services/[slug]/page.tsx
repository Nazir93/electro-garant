import { notFound } from "next/navigation";
import { getPageMeta } from "@/lib/get-page-meta";
import { getServiceLandingPageData } from "@/lib/get-service-landing-page";
import { ServiceLandingRenderer } from "@/components/landing/service-landing-renderer";
import {
  SERVICE_PAGE_SLUGS,
  getDefaultMetaForServiceSlug,
  isServicePageSlug,
  type ServicePageSlug,
} from "@/lib/service-landing-defaults";

export function generateStaticParams() {
  return SERVICE_PAGE_SLUGS.map((slug) => ({ slug }));
}

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  if (!isServicePageSlug(params.slug)) {
    return { title: "Услуга" };
  }
  const meta = getDefaultMetaForServiceSlug(params.slug as ServicePageSlug);
  return getPageMeta({
    title: meta.title,
    description: meta.description,
    path: `/services/${params.slug}`,
    keywords: meta.keywords,
  });
}

export default async function ServiceLandingPage({ params }: Props) {
  const data = await getServiceLandingPageData(params.slug);
  if (!data) notFound();
  if (!data.published) notFound();

  return <ServiceLandingRenderer document={data.document} />;
}
