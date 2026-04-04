import type { ReactNode } from "react";
import { BackNavLink } from "@/components/ui/back-nav";

type EditorialPageShellProps = {
  backHref: string;
  backLabel: string;
  meta?: ReactNode;
  title: string;
  /** Renders between H1 and lead (e.g. case meta grid) */
  belowTitle?: ReactNode;
  lead?: ReactNode;
  /** Content after title/lead (e.g. banner) — still inside max-width column */
  children?: ReactNode;
  /** Full-width blocks below the editorial column (e.g. portfolio extras) */
  after?: ReactNode;
  footer?: ReactNode;
};

/**
 * Shared article layout for blog posts and portfolio cases: padding, max width, typography scale.
 */
export function EditorialPageShell({
  backHref,
  backLabel,
  meta,
  title,
  belowTitle,
  lead,
  children,
  after,
  footer,
}: EditorialPageShellProps) {
  return (
    <article className="pt-28 pb-16 md:pt-36 md:pb-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto max-w-3xl px-5">
        <div className="mb-10">
          <BackNavLink href={backHref}>{backLabel}</BackNavLink>
        </div>

        {meta ? <div className="mb-6">{meta}</div> : null}

        <h1
          className="font-heading text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight mb-8"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h1>

        {belowTitle ? <div className="mb-8">{belowTitle}</div> : null}

        {lead ? (
          <div className="text-base md:text-lg leading-relaxed mb-10" style={{ color: "var(--text-muted)" }}>
            {lead}
          </div>
        ) : null}

        {children}

        {footer ? (
          <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            {footer}
          </div>
        ) : null}
      </div>

      {after}
    </article>
  );
}
