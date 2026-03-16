"use client";

const LOGOS = [
  { name: "FAMILY", src: "/logo/FAMILY.png" },
  { name: "LAVICON", src: "/logo/LAVICON.png" },
  { name: "Mr. Food", src: "/logo/Mr. food.jpg" },
  { name: "Radisson", src: "/logo/Radisson.webp" },
  { name: "Кашелот", src: "/logo/кашелот.svg" },
  { name: "Мандарин", src: "/logo/мандарин.png" },
  { name: "Папа Джонс", src: "/logo/папа джонс.webp" },
  { name: "Роза Хутор", src: "/logo/роза хутор.jpg" },
];

export function PartnersSection() {
  const titleDoubled = ["НАМ ДОВЕРЯЮТ", "НАМ ДОВЕРЯЮТ", "НАМ ДОВЕРЯЮТ"];
  const logosDoubled = [...LOGOS, ...LOGOS];

  return (
    <section
      id="partners"
      className="overflow-hidden"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      {/* Row 1: "НАМ ДОВЕРЯЮТ" scrolls LEFT (reversed), smaller */}
      <div className="overflow-hidden whitespace-nowrap">
        <div className="animate-marquee-right" style={{ animationDuration: "20s" }}>
          {titleDoubled.map((item, i) => (
            <span
              key={i}
              className="inline-block font-heading text-[14vw] leading-[0.95] tracking-tighter"
              style={{ color: "var(--text)", paddingRight: "4vw" }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Row 2: logos scroll RIGHT (reversed) */}
      <div className="overflow-hidden whitespace-nowrap py-4 sm:py-6 md:py-8">
        <div className="animate-marquee-left flex items-center" style={{ animationDuration: "25s" }}>
          {logosDoubled.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="inline-flex items-center justify-center mx-6 sm:mx-10 md:mx-14 flex-shrink-0"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-8 sm:h-10 md:h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 mix-blend-multiply dark:mix-blend-screen"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
