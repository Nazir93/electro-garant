"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PORTFOLIO_CASES } from "@/lib/portfolio-data";
import type { ProjectListItem } from "@/lib/get-projects";
import { isGifUrl } from "@/components/editorial/editorial-banner";

/** Растровое изображение по URL (в т.ч. PNG в поле «видео» — не в тег video) */
function isRasterImageUrl(url: string): boolean {
  return /\.(png|jpe?g|webp|gif|avif|bmp)(\?.*)?$/i.test(url);
}

function FillLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between mt-6 sm:mt-8 px-5 sm:px-8 py-5 sm:py-6 md:py-7 rounded-2xl font-heading text-lg sm:text-xl md:text-2xl relative overflow-hidden transition-all duration-500"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] rounded-2xl"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      <span
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      >
        {label}
      </span>
      <ArrowRight
        size={22}
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      />
    </Link>
  );
}

interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  type: string;
  year: string;
  shortDescription: string;
  coverImage?: string | null;
  videoUrl?: string | null;
}

function PortfolioRow({ project, index, isOpen, onToggle }: { project: PortfolioProject; index: number; isOpen: boolean; onToggle: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rowRef}
      className="border-b transition-all duration-700 ease-out"
      style={{
        borderColor: "var(--border)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(40px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Row */}
      <button
        onClick={onToggle}
        className="w-full grid grid-cols-[1fr_auto] md:grid-cols-[2fr_3fr_auto] items-center py-3.5 sm:py-4 lg:pr-20 text-left group cursor-pointer min-h-[48px]"
      >
        <span
          className="font-heading text-[10px] sm:text-xs md:text-sm tracking-[0.05em] transition-colors duration-200 group-hover:text-[var(--accent)] pr-3 leading-tight"
          style={{ color: "var(--text)" }}
        >
          {project.title.toUpperCase()}
        </span>
        <span
          className="hidden md:block text-xs md:text-sm tracking-[0.08em]"
          style={{ color: "var(--text-muted)" }}
        >
          {project.type}
        </span>
        <span className="text-[10px] sm:text-xs text-right tabular-nums" style={{ color: "var(--text-muted)" }}>
          ({project.year})
        </span>
      </button>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-[height] duration-500 ease-in-out"
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="pb-8 pt-2 lg:pr-20">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8">
            {/* Left: description */}
            <div className="max-w-sm">
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
                {project.shortDescription}
              </p>
              <Link
                href={`/portfolio/${project.slug}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] transition-colors duration-200 hover:text-[var(--accent)]"
                style={{ color: "var(--text)" }}
              >
                <span className="underline underline-offset-4">подробнее</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div
              className="aspect-[4/3] md:aspect-[16/10] flex items-center justify-center rounded-lg overflow-hidden relative bg-[var(--bg-secondary)]"
            >
              {project.videoUrl && (isGifUrl(project.videoUrl) || isRasterImageUrl(project.videoUrl)) ? (
                <img
                  src={visible ? project.videoUrl : undefined}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
              ) : project.videoUrl ? (
                <video
                  src={visible && isOpen ? project.videoUrl : undefined}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : project.coverImage ? (
                <img
                  src={visible ? project.coverImage : undefined}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
                  Фото / Видео проекта
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PortfolioSection({ projects: propProjects }: { projects?: ProjectListItem[] } = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items: PortfolioProject[] = propProjects && propProjects.length > 0
    ? propProjects.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        type: p.type,
        year: p.year,
        shortDescription: p.shortDescription,
        coverImage: p.coverImage,
        videoUrl: p.videoUrl,
      }))
    : PORTFOLIO_CASES.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        type: c.type,
        year: c.year,
        shortDescription: c.shortDescription,
        coverImage: null,
        videoUrl: c.videoUrl ?? null,
      }));

  return (
    <section
      id="portfolio"
      className="py-16 sm:py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      <div className="container mx-auto">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 sm:mb-12" style={{ color: "var(--text)" }}>
          Портфолио
        </h2>

        <div className="border-t" style={{ borderColor: "var(--border)" }}>
          {items.map((project, i) => (
            <PortfolioRow
              key={project.id}
              project={project}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        <FillLink href="/portfolio" label="Смотреть все проекты" />
      </div>
    </section>
  );
}
