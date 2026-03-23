import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { order: "asc" } },
        hotspots: true,
      },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("[ADMIN PROJECT GET]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.service !== undefined && { service: body.service }),
        ...(body.area !== undefined && { area: body.area ? parseInt(body.area) : null }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl || null }),
        ...(body.location !== undefined && { location: body.location || null }),
        ...(body.year !== undefined && { year: body.year || null }),
        ...(body.industry !== undefined && { industry: body.industry || null }),
        ...(body.projectType !== undefined && { projectType: body.projectType || null }),
        ...(body.features !== undefined && { features: body.features || null }),
        ...(body.goals !== undefined && { goals: body.goals || null }),
        ...(body.leftText1 !== undefined && { leftText1: body.leftText1 || null }),
        ...(body.rightText1 !== undefined && { rightText1: body.rightText1 || null }),
        ...(body.leftText2 !== undefined && { leftText2: body.leftText2 || null }),
        ...(body.rightText2 !== undefined && { rightText2: body.rightText2 || null }),
        ...(body.showcaseLabel1 !== undefined && { showcaseLabel1: body.showcaseLabel1 || null }),
        ...(body.showcaseLabel2 !== undefined && { showcaseLabel2: body.showcaseLabel2 || null }),
        ...(body.showcaseImage1 !== undefined && { showcaseImage1: body.showcaseImage1 || null }),
        ...(body.showcaseImage2 !== undefined && { showcaseImage2: body.showcaseImage2 || null }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("[ADMIN PROJECT UPDATE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN PROJECT DELETE]", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
}
