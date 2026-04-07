import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/get-projects";
import { getPageMeta } from "@/lib/get-page-meta";
import { CaseContent } from "./content";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return {};

  return getPageMeta({
    title: `${project.title} — ${project.type} | ${SITE_NAME}`,
    description: project.shortDescription,
    path: `/portfolio/${project.slug}`,
    keywords: [project.title, project.type, project.industry, SITE_NAME],
  });
}

export default async function CasePage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const allSlugs = await getAllProjectSlugs();

  return <CaseContent project={project} allSlugs={allSlugs} />;
}
