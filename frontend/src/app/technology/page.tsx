import type { Metadata } from "next";
import TechnologyContent from "./content";

export const metadata: Metadata = {
  title: "Технология монтажа — 13 этапов",
  description:
    "Собственная технология электромонтажа: 13 этапов от заявки до гарантийного обслуживания. Каждый шаг задокументирован и отработан на 280+ объектах.",
};

export default function TechnologyPage() {
  return <TechnologyContent />;
}
