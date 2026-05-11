import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const patch: {
      name?: string;
      unit?: string;
      price?: Prisma.Decimal | null;
      pdfLine?: number | null;
      isHeading?: boolean;
      fillKey?: string | null;
      sortOrder?: number;
    } = {};

    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.unit === "string") patch.unit = body.unit;
    if (typeof body.isHeading === "boolean") patch.isHeading = body.isHeading;
    if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
      patch.sortOrder = Math.floor(body.sortOrder);
    }
    if (body.pdfLine === null) patch.pdfLine = null;
    else if (typeof body.pdfLine === "number" && Number.isFinite(body.pdfLine)) {
      patch.pdfLine = Math.floor(body.pdfLine);
    }
    if (body.fillKey === null || body.fillKey === "") patch.fillKey = null;
    else if (typeof body.fillKey === "string") patch.fillKey = body.fillKey.trim() || null;

    if (body.price === null) patch.price = null;
    else if (typeof body.price === "number" && Number.isFinite(body.price)) {
      patch.price = new Prisma.Decimal(body.price);
    }

    const updated = await prisma.priceCalculatorItem.update({
      where: { id },
      data: patch,
    });

    return NextResponse.json({
      id: updated.id,
      pdfLine: updated.pdfLine,
      name: updated.name,
      unit: updated.unit,
      price: updated.price != null ? Number(updated.price) : null,
      isHeading: updated.isHeading,
      fillKey: updated.fillKey,
      sortOrder: updated.sortOrder,
    });
  } catch (e) {
    console.error("[admin price item PATCH]", e);
    return NextResponse.json({ error: "Не удалось сохранить" }, { status: 500 });
  }
}
