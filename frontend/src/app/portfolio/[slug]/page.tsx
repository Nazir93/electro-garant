import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/get-projects";
import { getPageMeta, getPageH1 } from "@/lib/get-page-meta";
import { CaseContent } from "./content";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};

  const path = `/portfolio/${project.slug}`;
  const keywords = [project.title, project.type, project.industry, SITE_NAME].filter(
    (k): k is string => Boolean(k && String(k).trim())
  );

  const defaultDescription =
    project.seoDescription?.trim() || project.shortDescription;

  return getPageMeta({
    title: `${project.title} — ${project.type} | ${SITE_NAME}`,
    description: defaultDescription,
    path,
    keywords,
    /** Превью в соцсетях, если в PageMeta не задано своё OG-изображение */
    ogImage: project.coverImage || undefined,
  });
}

export default async function CasePage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allSlugs = await getAllProjectSlugs();
  const path = `/portfolio/${project.slug}`;
  const pageH1 = await getPageH1(path, project.title);

  return <CaseContent project={project} allSlugs={allSlugs} pageH1={pageH1} />;
}
