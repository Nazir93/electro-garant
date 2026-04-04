"use client";

import { Calendar, Tag } from "lucide-react";
import { BackNavLink } from "@/components/ui/back-nav";
import { formatArticleBody } from "@/lib/html-content";
import { EditorialPageShell } from "@/components/editorial/editorial-page-shell";
import { EditorialBanner } from "@/components/editorial/editorial-banner";

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  coverVideo: string | null;
  createdAt: string;
}

function blogBannerSlides(post: Pick<BlogPost, "coverImage" | "coverVideo">) {
  const slides: { type: "image" | "video"; url: string }[] = [];
  const img = post.coverImage?.trim();
  const vid = post.coverVideo?.trim();
  if (img) slides.push({ type: "image", url: img });
  if (vid) slides.push({ type: "video", url: vid });
  return slides;
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const bannerSlides = blogBannerSlides(post);
  const date = new Date(post.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const meta = (
    <div className="flex flex-wrap items-center gap-4">
      <span
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
        style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        <Tag size={10} />
        {post.category}
      </span>
      <span
        className="inline-flex items-center gap-1.5 text-[10px] tracking-wider"
        style={{ color: "var(--text-subtle)" }}
      >
        <Calendar size={10} />
        {date}
      </span>
    </div>
  );

  return (
    <EditorialPageShell
      backHref="/blog"
      backLabel="Все статьи"
      meta={meta}
      title={post.title}
      titleClassName="font-heading text-2xl sm:text-3xl md:text-[1.75rem] lg:text-4xl leading-snug tracking-tight mb-6 break-words"
      lead={post.excerpt}
      footer={<BackNavLink href="/blog">Вернуться к статьям</BackNavLink>}
      fullWidthTop={
        bannerSlides.length > 0 ? (
          <EditorialBanner fullBleed slides={bannerSlides} alt={post.title} />
        ) : null
      }
    >
      <div
        className="prose prose-lg max-w-none"
        style={{ color: "var(--text)" }}
        dangerouslySetInnerHTML={{ __html: formatArticleBody(post.content) }}
      />
    </EditorialPageShell>
  );
}
