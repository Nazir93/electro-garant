import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sections = await prisma.priceCalculatorSection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        items: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (sections.length === 0) {
      return NextResponse.json(
        { error: "Прайс не загружен. Выполните миграцию и npm run db:seed-price на сервере." },
        { status: 503 }
      );
    }

    return NextResponse.json({
      sections: sections.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        items: s.items.map((i) => ({
          id: i.id,
          pdfLine: i.pdfLine,
          name: i.name,
          unit: i.unit,
          price: i.price != null ? Number(i.price) : null,
          isHeading: i.isHeading,
          fillKey: i.fillKey,
        })),
      })),
    });
  } catch (e) {
    console.error("[price-calculator GET]", e);
    return NextResponse.json({ error: "Ошибка базы данных" }, { status: 500 });
  }
}
