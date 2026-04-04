import { NextResponse } from "next/server";
import { ensureDefaultServices } from "@/lib/seed-default-services";

export async function POST() {
  try {
    const result = await ensureDefaultServices();
    return NextResponse.json(result);
  } catch (error) {
    console.error("[ADMIN SERVICES SEED]", error);
    return NextResponse.json({ error: "Не удалось создать услуги" }, { status: 500 });
  }
}
