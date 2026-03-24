"use client";

const LOGOS: { name: string; src: string; h?: number }[] = [
  { name: "FAMILY", src: "/logo/FAMILY.png" },
  { name: "LAVICON", src: "/logo/LAVICON.png" },
  { name: "Mr. Food", src: "/logo/Mr. food.jpg" },
  { name: "Radisson", src: "/logo/Radisson.webp" },
  { name: "Кашелот", src: "/logo/кашелот.svg" },
  { name: "Мандарин", src: "/logo/мандарин.png", h: 52 },
  { name: "Папа Джонс", src: "/logo/papa-johns.png", h: 56 },
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
      {/* Row 1: "НАМ ДОВЕРЯЮТ" */}
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

      {/* Row 2: logos — always white background */}
      <div
        className="overflow-hidden whitespace-nowrap py-4 sm:py-5 md:py-6"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="animate-marquee-left flex items-center" style={{ animationDuration: "15s" }}>
          {logosDoubled.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className="inline-flex items-center justify-center mx-6 sm:mx-10 md:mx-14 flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="w-auto object-contain"
                style={{
                  height: `${logo.h || 40}px`,
                  maxWidth: "130px",
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
