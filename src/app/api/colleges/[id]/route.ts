import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!college) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(college);
  } catch (err) {
    console.error("College detail error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
