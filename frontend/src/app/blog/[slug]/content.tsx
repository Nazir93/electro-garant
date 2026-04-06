"use client";

import { useMemo, useState } from "react";
import { Calendar, Tag } from "lucide-react";
import { BackNavLink } from "@/components/ui/back-nav";
import { formatArticleBody } from "@/lib/html-content";
import { EditorialPageShell } from "@/components/editorial/editorial-page-shell";
import { EditorialBanner, editorialSlidesFromImagesAndVideo } from "@/components/editorial/editorial-banner";
import { ImageLightbox } from "@/components/ui/image-lightbox";

function lightboxIndexForSlide(slides: { type: "image" | "video"; url: string }[], slideIndex: number): number | null {
  if (slides[slideIndex]?.type !== "image") return null;
  return slides.slice(0, slideIndex).filter((s) => s.type === "image").length;
}

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  coverVideo: string | null;
  coverVideos?: string[];
  galleryUrls?: string[];
  createdAt: string;
}

function blogBannerSlides(post: BlogPost) {
  const imageUrls: (string | null | undefined)[] = [post.coverImage, ...(post.galleryUrls ?? [])];
  const videoArr = post.coverVideos?.length ? post.coverVideos : post.coverVideo ? [post.coverVideo] : [];
  return editorialSlidesFromImagesAndVideo(imageUrls, videoArr);
}

export function BlogPostContent({ post }: { post: BlogPost }) {
  const bannerSlides = useMemo(() => blogBannerSlides(post), [post]);
  const lightboxUrls = useMemo(
    () => bannerSlides.filter((s) => s.type === "image").map((s) => s.url),
    [bannerSlides]
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
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
    <>
      <ImageLightbox
        urls={lightboxUrls}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
        alt={post.title}
      />
      <EditorialPageShell
        backHref="/blog"
        backLabel="Все статьи"
        meta={meta}
        title={post.title}
        mediaAfterTitle={
          bannerSlides.length > 0 ? (
            <EditorialBanner
              slides={bannerSlides}
              alt={post.title}
              borderedFrame
              onImageClick={(slideIdx) => {
                const li = lightboxIndexForSlide(bannerSlides, slideIdx);
                if (li === null) return;
                setLightboxIndex(li);
                setLightboxOpen(true);
              }}
            />
          ) : null
        }
        lead={post.excerpt}
        footer={<BackNavLink href="/blog">Вернуться к статьям</BackNavLink>}
      >
        <div
          className="prose prose-lg max-w-none"
          style={{ color: "var(--text)" }}
          dangerouslySetInnerHTML={{ __html: formatArticleBody(post.content) }}
        />
      </EditorialPageShell>
    </>
  );
}
