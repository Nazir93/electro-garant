import { describe, expect, it } from "vitest";
import {
  patchPriceCalculatorSections,
  type PatchSection,
} from "@/lib/price-calculator-patch";

describe("patchPriceCalculatorSections", () => {
  it("переносит заголовок пустого раздела в начало следующего раздела", () => {
    const sections: PatchSection[] = [
      {
        slug: "empty",
        title: "Только заголовок",
        items: [],
      },
      {
        slug: "real",
        title: "Работы",
        items: [
          {
            pdfLine: 10,
            name: "Позиция",
            unit: "шт",
            price: 500,
            isHeading: false,
          },
        ],
      },
    ];
    const out = patchPriceCalculatorSections({ sections });
    expect(out).toHaveLength(1);
    expect(out[0].items[0].isHeading).toBe(true);
    expect(out[0].items[0].name).toBe("Только заголовок");
    expect(out[0].items[1].name).toBe("Позиция");
  });

  it("делит склеенную позицию 145 «До 96 / Свыше 96» на две строки", () => {
    const merged =
      "Монтаж встраиваемого электрощита До 96 модулей шт. Монтаж встраиваемого электрощита Свыше 96 модулей шт.";
    const sections: PatchSection[] = [
      {
        slug: "s",
        title: "Щиты",
        items: [
          {
            pdfLine: 145,
            name: merged,
            unit: "шт",
            price: 3500,
            isHeading: false,
          },
        ],
      },
    ];
    const out = patchPriceCalculatorSections({ sections });
    const items = out[0].items;
    expect(items).toHaveLength(2);
    expect(items[0].pdfLine).toBe(145);
    expect(items[0].price).toBeNull();
    expect(items[1].pdfLine).toBeNull();
    expect(items[1].price).toBe(3500);
    expect(items[1].name).toMatch(/Свыше 96/);
  });

  it("назначает разным разделам разные slug", () => {
    const sections: PatchSection[] = [
      {
        slug: "dup",
        title: "Same",
        items: [{ pdfLine: 1, name: "a", unit: "шт", price: 1, isHeading: false }],
      },
      {
        slug: "dup",
        title: "Same",
        items: [{ pdfLine: 2, name: "b", unit: "шт", price: 2, isHeading: false }],
      },
    ];
    const out = patchPriceCalculatorSections({ sections });
    expect(out).toHaveLength(2);
    expect(out[0].slug).not.toBe(out[1].slug);
    expect(out.map((s) => s.slug)).toEqual(["same-0", "same-1"]);
  });
});
