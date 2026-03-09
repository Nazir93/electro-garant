import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getCaseBySlug, getAllCaseSlugs } from "@/lib/portfolio-data";
import { CaseContent } from "./content";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllCaseSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = getCaseBySlug(params.slug);
  if (!project) return {};

  return {
    title: `${project.title} — ${project.type} | ${SITE_NAME}`,
    description: project.shortDescription,
    openGraph: {
      title: `${project.title} | ${SITE_NAME}`,
      description: project.shortDescription,
      type: "article",
      url: `${SITE_URL}/portfolio/${project.slug}`,
    },
    alternates: { canonical: `/portfolio/${project.slug}` },
  };
}

export default function CasePage({ params }: Props) {
  const project = getCaseBySlug(params.slug);
  if (!project) notFound();

  return <CaseContent project={project} />;
}
