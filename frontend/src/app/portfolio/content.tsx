"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDown, SlidersHorizontal } from "lucide-react";
import type { ProjectListItem } from "@/lib/get-projects";
import { formatArticleBody, PAGE_INTRO_PROSE_CLASS } from "@/lib/html-content";

function LoadMoreButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between mt-6 px-8 py-6 md:py-7 rounded-2xl font-heading text-xl md:text-2xl lg:text-3xl transition-all duration-500 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)" }}
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
        Смотреть ещё
      </span>
      <ArrowDown
        size={24}
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      />
    </button>
  );
}

function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg block"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-5 md:gap-8 p-4 md:p-6">
        <div
          className="shrink-0 w-28 h-20 md:w-40 md:h-28 rounded-xl overflow-hidden flex items-center justify-center relative"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="160px"
              unoptimized={project.coverImage.startsWith("/uploads/")}
            />
          ) : (
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-subtle)" }}>
              Фото
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-3 md:mb-4 flex-wrap">
            <h3
              className="font-heading text-xl md:text-2xl lg:text-3xl tracking-tight transition-colors duration-200 group-hover:text-[var(--accent)]"
              style={{ color: "var(--text)" }}
            >
              {project.title}
            </h3>
            <span className="text-sm shrink-0" style={{ color: "var(--text-muted)" }}>
              ({project.year})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.1em] block mb-0.5 font-medium" style={{ color: "var(--text-muted)" }}>
                Отрасль
              </span>
              <span className="text-xs uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                {project.industry}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.1em] block mb-0.5 font-medium" style={{ color: "var(--text-muted)" }}>
                Тип проекта
              </span>
              <span className="text-xs uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                {project.type}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="shrink-0">
          <ArrowRight
            size={28}
            className="transition-transform duration-300 group-hover:translate-x-1"
            style={{ color: "var(--text)" }}
          />
        </div>
      </div>
    </Link>
  );
}

const INITIAL_COUNT = 5;

const FILTER_MAP: Record<string, string[]> = {
  "Электромонтаж": ["электромонтаж"],
  "Умный дом": ["умный дом"],
  "Акустика": ["акустика", "мультирум"],
  "Видеонаблюдение": ["видеонаблюдение", "скуд", "безопасность"],
  "СКС": ["скс", "слаботочные", "кабельн"],
};

export function PortfolioPageContent({
  projects,
  pageH1,
  introText,
  bannerUrl,
  bodyHtml,
}: {
  projects: ProjectListItem[];
  pageH1: string;
  introText: string;
  bannerUrl: string | null;
  bodyHtml?: string | null;
}) {
  const [showAll, setShowAll] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Все");

  const filtered = activeFilter === "Все"
    ? projects
    : projects.filter((p) => {
        const keywords = FILTER_MAP[activeFilter];
        if (!keywords) return true;
        const haystack = `${p.type} ${p.tag} ${p.industry}`.toLowerCase();
        return keywords.some((kw) => haystack.includes(kw));
      });

  const visibleProjects = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);

  const FILTERS = ["Все", "Электромонтаж", "Умный дом", "Акустика", "Видеонаблюдение", "СКС"];

  return (
    <section className="pt-12 pb-20 md:pt-16 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto max-w-5xl px-5">
        <span
          className="inline-block text-[10px] sm:text-xs uppercase tracking-[0.12em] px-3 py-1.5 rounded-full mb-4 sm:mb-5"
          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          Портфолио
        </span>
        <h1
          className="font-heading text-2xl sm:text-3xl md:text-4xl leading-snug tracking-tight mb-6 sm:mb-8 max-w-3xl break-words"
          style={{ color: "var(--text)" }}
        >
          {pageH1}
        </h1>
        {bannerUrl ? (
          <div className="relative mb-8 sm:mb-10 w-full aspect-[16/9] max-h-[min(46vh,420px)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
            <Image
              src={bannerUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, min(1024px, 100vw)"
              priority
              unoptimized={bannerUrl.startsWith("/uploads/")}
            />
          </div>
        ) : null}
        <div
          className={`${PAGE_INTRO_PROSE_CLASS} ${bodyHtml ? "mb-8 md:mb-10" : "mb-10 md:mb-14"}`}
          style={{ color: "var(--text-muted)" }}
          dangerouslySetInnerHTML={{ __html: formatArticleBody(introText) }}
        />
        {bodyHtml ? (
          <div
            className={`${PAGE_INTRO_PROSE_CLASS} mb-10 md:mb-14 max-w-none w-full overflow-x-auto sm:max-w-full`}
            style={{ color: "var(--text-muted)" }}
            dangerouslySetInnerHTML={{ __html: formatArticleBody(bodyHtml) }}
          />
        ) : null}
      </div>

      <div className="container mx-auto px-5">
        {/* Filters toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] mb-2 transition-colors duration-200 hover:text-[var(--text)]"
          style={{ color: "var(--text-muted)" }}
        >
          <span>{filtersOpen ? "Скрыть фильтры" : "Раскрыть фильтры"}</span>
          <SlidersHorizontal size={14} />
        </button>
        <div className="h-px mb-8" style={{ backgroundColor: "var(--border)" }} />

        {/* Filters */}
        {filtersOpen && (
          <div className="flex flex-wrap gap-3 mb-8">
            {FILTERS.map((f) => (
              <button
                key={f}
                className="px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.1em] transition-all duration-200"
                style={{
                  border: "1px solid var(--border)",
                  color: activeFilter === f ? "var(--bg)" : "var(--text-muted)",
                  backgroundColor: activeFilter === f ? "var(--text)" : "transparent",
                }}
                onClick={() => setActiveFilter(f)}
                onMouseEnter={(e) => {
                  if (activeFilter !== f) {
                    e.currentTarget.style.backgroundColor = "var(--text)";
                    e.currentTarget.style.color = "var(--bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== f) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }
                }}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Load more */}
        {!showAll && filtered.length > INITIAL_COUNT && (
          <LoadMoreButton onClick={() => setShowAll(true)} />
        )}
      </div>
    </section>
  );
}
