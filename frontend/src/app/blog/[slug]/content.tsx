"use client";

import Image from "next/image";
import { Calendar, Tag } from "lucide-react";
import { BackNavLink } from "@/components/ui/back-nav";
import { formatArticleBody } from "@/lib/html-content";

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  createdAt: string;
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const date = new Date(post.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="pt-28 pb-16 md:pt-36 md:pb-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto max-w-3xl px-5">
        <div className="mb-10">
          <BackNavLink href="/blog">Все статьи</BackNavLink>
        </div>

        <div className="flex items-center gap-4 mb-6">
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

        <h1
          className="font-heading text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-8"
          style={{ color: "var(--text)" }}
        >
          {post.title}
        </h1>

        <p className="text-base md:text-lg leading-relaxed mb-10" style={{ color: "var(--text-muted)" }}>
          {post.excerpt}
        </p>

        {post.coverImage && (
          <div className="relative w-full aspect-[16/9] mb-10 rounded-2xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          style={{ color: "var(--text)" }}
          dangerouslySetInnerHTML={{ __html: formatArticleBody(post.content) }}
        />

        <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <BackNavLink href="/blog">Вернуться к статьям</BackNavLink>
        </div>
      </div>
    </article>
  );
}
