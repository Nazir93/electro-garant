import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await prisma.service.findUnique({ where: { id: params.id } });
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(service);
  } catch (error) {
    console.error("[ADMIN SERVICE GET]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.serviceType !== undefined && { serviceType: body.serviceType }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("[ADMIN SERVICE UPDATE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN SERVICE DELETE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
