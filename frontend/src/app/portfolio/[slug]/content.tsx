"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import type { PortfolioCase } from "@/lib/portfolio-data";
import { EditorialPageShell } from "@/components/editorial/editorial-page-shell";
import { EditorialBanner, editorialSlidesFromImagesAndVideo } from "@/components/editorial/editorial-banner";
import { formatArticleBody } from "@/lib/html-content";
import { ImageLightbox } from "@/components/ui/image-lightbox";

function useScrollVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function caseBannerUrls(p: PortfolioCase): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (u?: string | null) => {
    const s = u?.trim();
    if (!s || seen.has(s)) return;
    seen.add(s);
    out.push(s);
  };
  push(p.coverImage);
  for (const u of p.galleryUrls ?? []) push(u);
  return out;
}

function TextBlock({ leftText, rightText, accent }: { leftText: string; rightText: string; accent?: boolean }) {
  const { ref, visible } = useScrollVisible(0.2);

  return (
    <section
      ref={ref}
      className="py-20 md:py-28"
      style={{
        backgroundColor: accent ? "var(--bg-secondary)" : "var(--bg)",
        borderTop: accent ? "1px solid var(--border)" : undefined,
        borderBottom: accent ? "1px solid var(--border)" : undefined,
      }}
    >
      <div className="container mx-auto max-w-5xl px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
            }}
          >
            <div
              className="prose prose-sm max-w-none text-sm md:text-base leading-[1.8]"
              style={{ color: "var(--text-muted)" }}
              dangerouslySetInnerHTML={{ __html: formatArticleBody(leftText) }}
            />
          </div>
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transitionDelay: "100ms",
            }}
          >
            <div
              className="prose prose-sm max-w-none text-sm md:text-base leading-[1.8]"
              style={{ color: "var(--text-muted)" }}
              dangerouslySetInnerHTML={{ __html: formatArticleBody(rightText) }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function NavLink({ href, label, direction }: { href: string; label: string; direction: "prev" | "next" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-1 flex items-center gap-4 px-6 py-6 md:py-8 rounded-2xl relative overflow-hidden transition-all duration-500"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      {direction === "prev" && (
        <ArrowLeft
          size={20}
          className="relative z-10 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        />
      )}
      <div className="relative z-10 flex-1">
        <span
          className="text-[10px] uppercase tracking-[0.15em] block mb-1 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text-muted)" }}
        >
          {direction === "prev" ? "Предыдущий проект" : "Следующий проект"}
        </span>
        <span
          className="font-heading text-lg md:text-xl transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        >
          {label}
        </span>
      </div>
      {direction === "next" && (
        <ArrowRight
          size={20}
          className="relative z-10 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        />
      )}
    </Link>
  );
}

function lightboxIndexForSlide(
  slides: { type: "image" | "video"; url: string }[],
  slideIndex: number
): number | null {
  if (slides[slideIndex]?.type !== "image") return null;
  return slides.slice(0, slideIndex).filter((s) => s.type === "image").length;
}

export function CaseContent({ project, allSlugs = [] }: { project: PortfolioCase; allSlugs?: string[] }) {
  const currentIndex = allSlugs.indexOf(project.slug);
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  const bannerSlides = useMemo(
    () => editorialSlidesFromImagesAndVideo(caseBannerUrls(project), project.videoUrl),
    [project]
  );
  const lightboxUrls = useMemo(
    () => bannerSlides.filter((s) => s.type === "image").map((s) => s.url),
    [bannerSlides]
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const metaPills = (
    <div className="flex flex-wrap items-center gap-4">
      <span
        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
        style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
      >
        <Tag size={10} />
        {project.tag}
      </span>
      <span
        className="inline-flex items-center gap-1.5 text-[10px] tracking-wider"
        style={{ color: "var(--text-subtle)" }}
      >
        <Calendar size={10} />
        {project.year}
      </span>
    </div>
  );

  const metaGrid = (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { label: "Отрасль", value: project.industry },
        { label: "Услуга", value: project.type },
        { label: "Площадь", value: project.area },
        { label: "Год", value: project.year },
      ].map((item) => (
        <div key={item.label}>
          <span
            className="text-[10px] uppercase tracking-[0.15em] block mb-1"
            style={{ color: "var(--text-muted)" }}
          >
            {item.label}
          </span>
          <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
            {item.value}
          </span>
        </div>
      ))}
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
        alt={project.title}
      />
      <EditorialPageShell
        backHref="/portfolio"
        backLabel="Вернуться к проектам"
        meta={metaPills}
        title={project.title}
        belowTitle={metaGrid}
        mediaAfterTitle={
          bannerSlides.length > 0 ? (
            <EditorialBanner
              slides={bannerSlides}
              alt={project.title}
              fullBleed={false}
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
        lead={
          project.heroDescription ? (
            <div
              className="prose prose-sm md:prose-base max-w-none"
              style={{ color: "var(--text-muted)" }}
              dangerouslySetInnerHTML={{ __html: formatArticleBody(project.heroDescription) }}
            />
          ) : null
        }
      />

      {(project.features.length > 0 || project.goals.trim()) && (
        <section className="pb-16 md:pb-24" style={{ backgroundColor: "var(--bg)" }}>
          <div className="container mx-auto max-w-3xl px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {project.features.length > 0 && (
                <div>
                  <ul className="space-y-3">
                    {project.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {project.goals.trim() && (
                <div className="border-t md:border-t-0 md:border-l pt-8 md:pt-0 md:pl-12" style={{ borderColor: "var(--border)" }}>
                  <p
                    className="text-[10px] uppercase tracking-[0.15em] font-bold mb-2"
                    style={{ color: "var(--text)" }}
                  >
                    Ключевые задачи
                  </p>
                  <div
                    className="prose prose-sm max-w-none text-sm md:text-base leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                    dangerouslySetInnerHTML={{ __html: formatArticleBody(project.goals) }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {project.leftText1.trim() || project.rightText1.trim() ? (
        <TextBlock leftText={project.leftText1} rightText={project.rightText1} />
      ) : null}

      {project.leftText2.trim() || project.rightText2.trim() ? (
        <TextBlock leftText={project.leftText2} rightText={project.rightText2} accent />
      ) : null}

      {(prevSlug || nextSlug) && (
        <section
          className="py-16 md:py-20"
          style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
        >
          <div className="container mx-auto max-w-3xl px-5">
            <div className="flex flex-col md:flex-row gap-4">
              {prevSlug && <NavLink href={`/portfolio/${prevSlug}`} label="Предыдущий" direction="prev" />}
              {nextSlug && <NavLink href={`/portfolio/${nextSlug}`} label="Следующий" direction="next" />}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
