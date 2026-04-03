/**
 * Ориентировочный расчёт (модалка): ₽/м² по сегментам эконом / стандарт / премиум.
 * Черновой и чистовой — с вариантами «материалы нет / да».
 * Проектирование — материал всегда «нет», черновой/чистовой по одной таблице.
 */

export const CALC_SERVICE_IDS = [
  "electrical",
  "lighting",
  "acoustics",
  "cabling",
  "smart-home",
  "security",
] as const;

export type CalcServiceId = (typeof CALC_SERVICE_IDS)[number];

export type WorkMode = "rough" | "finish" | "design";

type Triple = [number, number, number]; // econom, standard, premium

type MatRow = { noMat: Triple; withMat: Triple };

/** Черновой этап */
export const PRICES_ROUGH: Record<CalcServiceId, MatRow> = {
  electrical: {
    noMat: [2500, 4000, 5500],
    withMat: [4000, 7500, 10800],
  },
  lighting: {
    noMat: [800, 1400, 2800],
    withMat: [1200, 2200, 5600],
  },
  acoustics: {
    noMat: [800, 1400, 2100],
    withMat: [2300, 2900, 3600],
  },
  cabling: {
    noMat: [550, 800, 1600],
    withMat: [1100, 1900, 4400],
  },
  "smart-home": {
    noMat: [4000, 6500, 9800],
    withMat: [6800, 9900, 15600],
  },
  security: {
    noMat: [500, 1200, 2400],
    withMat: [800, 2400, 6200],
  },
};

/** Чистовой этап */
export const PRICES_FINISH: Record<CalcServiceId, MatRow> = {
  electrical: {
    noMat: [1200, 1800, 4000],
    withMat: [2400, 4000, 13200],
  },
  lighting: {
    noMat: [400, 650, 1400],
    withMat: [800, 1300, 5800],
  },
  acoustics: {
    noMat: [1000, 1600, 3500],
    withMat: [7000, 12600, 29000],
  },
  cabling: {
    noMat: [400, 650, 1400],
    withMat: [1400, 2300, 4800],
  },
  "smart-home": {
    noMat: [1500, 2800, 7800],
    withMat: [4000, 6500, 28000],
  },
  security: {
    noMat: [400, 650, 1400],
    withMat: [800, 1300, 5800],
  },
};

/** Проектирование (материал не используется — одна строка на услугу) */
export const PRICES_DESIGN: Record<CalcServiceId, Triple> = {
  electrical: [800, 1400, 2000],
  lighting: [450, 800, 1450],
  acoustics: [400, 650, 1000],
  cabling: [400, 650, 1000],
  "smart-home": [1000, 1500, 3800],
  security: [400, 650, 1000],
};

const TIERS = ["econom", "standard", "premium"] as const;

/** Индекс сегмента 0..2 */
export function tierIndex(tier: string): number {
  const i = TIERS.indexOf(tier as (typeof TIERS)[number]);
  return i >= 0 ? i : 1;
}

/** Понижающий коэффициент для архитектурной подсветки: 0.9 на каждый этаж после первого */
export function lightingFloorMultiplier(floorCount: number): number {
  const n = Math.max(1, Math.floor(floorCount));
  if (n <= 1) return 1;
  return 0.9 ** (n - 1);
}

/** Парсинг этажей: «5+» → 5 */
export function parseFloorCount(raw: string | undefined): number {
  if (!raw || raw.trim() === "") return 1;
  if (raw.includes("+")) return Math.max(1, parseInt(raw, 10) || 5);
  return Math.max(1, parseInt(raw, 10) || 1);
}

export function computeCalculatorEstimate(params: {
  workMode: WorkMode;
  services: string[];
  tier: string;
  withMaterials: boolean;
  areaRaw: number;
  floorsRaw: string | undefined;
}): { total: number; areaUsed: number; lightingMultiplier: number } | null {
  const areaUsed = params.areaRaw > 0 ? Math.max(params.areaRaw, 30) : 0;
  if (areaUsed <= 0 || params.services.length === 0) return null;

  const t = tierIndex(params.tier);
  const floors = parseFloorCount(params.floorsRaw);
  const lightingMult = lightingFloorMultiplier(floors);

  let sumPerSqm = 0;

  for (const s of params.services) {
    if (!CALC_SERVICE_IDS.includes(s as CalcServiceId)) continue;

    const id = s as CalcServiceId;

    if (params.workMode === "design") {
      sumPerSqm += PRICES_DESIGN[id][t];
      continue;
    }

    const table = params.workMode === "rough" ? PRICES_ROUGH : PRICES_FINISH;
    const row = table[id];
    const triple = params.withMaterials ? row.withMat : row.noMat;
    let rate = triple[t];

    if (id === "lighting") {
      rate *= lightingMult;
    }

    sumPerSqm += rate;
  }

  return {
    total: Math.round(areaUsed * sumPerSqm),
    areaUsed,
    lightingMultiplier: lightingMult,
  };
}
