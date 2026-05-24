import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) || [];

  if (ids.length < 2) return NextResponse.json({ error: "Need at least 2 colleges" }, { status: 400 });

  const colleges = await prisma.college.findMany({
    where: { id: { in: ids } },
    include: {
      courses: true,
      placements: { orderBy: { year: "desc" }, take: 1 },
      _count: { select: { reviews: true } },
    },
  });

  return NextResponse.json(colleges);
}
