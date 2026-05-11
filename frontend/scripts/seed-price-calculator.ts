/**
 * Заливка прайса калькулятора в БД (после prisma migrate / db push).
 * npm run db:generate && npx dotenv -e .env.local -- npx tsx scripts/seed-price-calculator.ts
 */
import { readFileSync } from "fs";
import path from "path";
import { Prisma } from "@prisma/client";
import { prisma } from "../src/lib/db";
import { patchPriceCalculatorSections, type PatchSection } from "../src/lib/price-calculator-patch";

const rawPath = path.join(process.cwd(), "src/data/price-calculator-generated.json");
const rawJson = JSON.parse(readFileSync(rawPath, "utf8")) as { sections: PatchSection[] };

/** Стабильные ключи автозаполнения (первая позиция с данным pdfLine получает ключ) */
const FILL_KEY_BY_PDF_LINE: Record<number, string> = {
  1: "cable_3x2_5",
  2: "cable_3x6",
  3: "cable_3x10",
  4: "cable_5x6",
  5: "cable_5x10",
  6: "cable_5x16",
  7: "cable_5x35",
  15: "cable_acoustic",
  16: "cable_decor",
  29: "utp_sat_tel",
  34: "rj45_crimp",
  55: "pull_corrugated_with",
  57: "pipe_pvh_16_25",
  65: "cable_channel_25x16",
  66: "cable_channel_60x40",
  71: "tray_metal_100",
  72: "tray_metal_200_400",
  73: "tray_metal_500_600",
  78: "tray_console",
  87: "chase_brick",
  91: "plaster_chase",
  98: "drill_through_brick",
  100: "drill_through_concrete",
  102: "drill_metal",
  119: "hole_drill_brick_75",
  121: "hole_drill_concrete_75",
  126: "socket_box_in_wall",
  127: "junction_box_install",
  128: "junction_wago_group",
  167: "panel_cable_entry",
  170: "din_automation_module",
  177: "lug_nshvi",
  189: "socket_outer_zk",
  191: "socket_inner_zk",
  193: "connector_1ph_surface",
  194: "connector_1ph_flush",
  195: "connector_3ph_surface",
  196: "connector_3ph_flush",
  200: "switch_1_inner",
  202: "switch_1_outer",
  204: "switch_2_inner_pass",
  228: "hole_spot_fixture",
  229: "light_wall_bracket",
  230: "light_ars_armstrong",
  231: "light_ceiling",
  232: "spot_light_ceiling",
};

function dec(v: number | null): Prisma.Decimal | null {
  if (v == null) return null;
  return new Prisma.Decimal(v);
}

async function main() {
  const patched = patchPriceCalculatorSections(rawJson);

  await prisma.priceCalculatorItem.deleteMany({});
  await prisma.priceCalculatorSection.deleteMany({});

  const usedFill = new Set<string>();

  for (let si = 0; si < patched.length; si++) {
    const sec = patched[si];
    const section = await prisma.priceCalculatorSection.create({
      data: {
        slug: sec.slug,
        title: sec.title,
        sortOrder: si,
      },
    });

    for (let ii = 0; ii < sec.items.length; ii++) {
      const it = sec.items[ii];
      let fillKey: string | undefined;
      if (it.pdfLine != null) {
        const cand = FILL_KEY_BY_PDF_LINE[it.pdfLine];
        if (cand && !usedFill.has(cand)) {
          usedFill.add(cand);
          fillKey = cand;
        }
      }

      await prisma.priceCalculatorItem.create({
        data: {
          sectionId: section.id,
          sortOrder: ii,
          pdfLine: it.pdfLine ?? null,
          name: it.name,
          unit: it.unit || "",
          price: it.price != null ? dec(it.price) : null,
          isHeading: it.isHeading,
          fillKey,
        },
      });
    }
  }

  const cnt = await prisma.priceCalculatorItem.count();
  console.log("[seed-price-calculator] OK, items:", cnt, "sections:", patched.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
