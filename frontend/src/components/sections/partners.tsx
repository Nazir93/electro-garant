"use client";

const PARTNERS = [
  "Legrand", "ABB", "Schneider Electric", "Hikvision",
  "DKC", "IEK", "TDM Electric", "EKF",
];

export function PartnersSection() {
  const titleDoubled = ["ПАРТНЁРЫ", "ПАРТНЁРЫ", "ПАРТНЁРЫ"];
  const logosDoubled = [...PARTNERS, ...PARTNERS];

  return (
    <section
      id="partners"
      className="overflow-hidden"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      {/* Row 1: giant "ПАРТНЁРЫ" scrolls left to right */}
      <div className="overflow-hidden whitespace-nowrap">
        <div className="animate-marquee-right" style={{ animationDuration: "25s" }}>
          {titleDoubled.map((item, i) => (
            <span
              key={i}
              className="inline-block font-heading text-[22vw] leading-[0.95] tracking-tighter"
              style={{ color: "var(--text)", paddingRight: "4vw" }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: logos scroll right to left */}
      <div className="overflow-hidden whitespace-nowrap py-5 md:py-6">
        <div className="animate-marquee-left" style={{ animationDuration: "30s" }}>
          {logosDoubled.map((partner, i) => (
            <span
              key={`${partner}-${i}`}
              className="inline-block mx-8 md:mx-14 text-sm md:text-base uppercase tracking-[0.15em] transition-colors duration-300 cursor-default hover:text-[var(--text)]"
              style={{ color: "var(--text-muted)" }}
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
