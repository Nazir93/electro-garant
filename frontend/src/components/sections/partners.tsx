"use client";

const CLIENTS = [
  "FAMILY", "LAVICON", "MR. FOOD", "RADISSON",
  "КАШЕЛОТ", "МАНДАРИН", "ПАПА ДЖОНС", "РОЗА ХУТОР",
];

export function PartnersSection() {
  const titleDoubled = ["НАМ ДОВЕРЯЮТ", "НАМ ДОВЕРЯЮТ", "НАМ ДОВЕРЯЮТ"];
  const clientsDoubled = [...CLIENTS, ...CLIENTS];

  return (
    <section
      id="partners"
      className="overflow-hidden"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      {/* Row 1: giant "НАМ ДОВЕРЯЮТ" scrolls right */}
      <div className="overflow-hidden whitespace-nowrap">
        <div className="animate-marquee-right" style={{ animationDuration: "20s" }}>
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

      {/* Row 2: client names scroll left */}
      <div className="overflow-hidden whitespace-nowrap py-3 sm:py-5 md:py-6">
        <div className="animate-marquee-left" style={{ animationDuration: "25s" }}>
          {clientsDoubled.map((client, i) => (
            <span
              key={`${client}-${i}`}
              className="inline-block mx-5 sm:mx-8 md:mx-14 text-xs sm:text-sm md:text-base uppercase tracking-[0.12em] sm:tracking-[0.15em] transition-colors duration-300 cursor-default hover:text-[var(--text)]"
              style={{ color: "var(--text-muted)" }}
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
