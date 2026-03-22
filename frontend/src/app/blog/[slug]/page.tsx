import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { BlogPostContent } from "./content";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let post: { title: string; excerpt: string; slug: string; coverImage: string | null } | null = null;
  try {
    post = await prisma.post.findUnique({
      where: { slug: params.slug, published: true },
      select: { title: true, excerpt: true, slug: true, coverImage: true },
    });
  } catch {
    return {};
  }
  if (!post) return {};

  const title = `${post.title} | ${SITE_NAME}`;
  return {
    title,
    description: post.excerpt,
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

async function getPost(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <BlogPostContent
      post={{
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        coverImage: post.coverImage,
        createdAt: post.createdAt.toISOString(),
      }}
    />
  );
}
