/** Публичный формат прайса калькулятора (GET /api/price-calculator) */
export type PriceCalculatorItemDTO = {
  id: string;
  pdfLine: number | null;
  name: string;
  unit: string;
  price: number | null;
  isHeading: boolean;
  fillKey: string | null;
};

export type PriceCalculatorSectionDTO = {
  id: string;
  slug: string;
  title: string;
  items: PriceCalculatorItemDTO[];
};
