/**
 * Генерирует JSON лендингов услуг (как «Подставить шаблон») в docs/seo/landing-json/.
 * Запуск из каталога frontend: npx tsx scripts/export-service-landings.ts
 */
import fs from "node:fs";
import path from "node:path";
import type { ServiceType } from "@prisma/client";
import {
  getDefaultServiceLandingDocument,
  SERVICE_PAGE_SLUG_TO_TYPE,
} from "../src/lib/service-landing-defaults";

const types = Object.values(SERVICE_PAGE_SLUG_TO_TYPE);
const slugByType = Object.fromEntries(
  Object.entries(SERVICE_PAGE_SLUG_TO_TYPE).map(([slug, t]) => [t, slug])
) as Record<ServiceType, string>;

const outDir = path.join(process.cwd(), "docs", "seo", "landing-json");
fs.mkdirSync(outDir, { recursive: true });

for (const serviceType of types) {
  const doc = getDefaultServiceLandingDocument(serviceType);
  const slug = slugByType[serviceType];
  const file = path.join(outDir, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(doc, null, 2), "utf8");
  console.log("written", path.relative(process.cwd(), file));
}
