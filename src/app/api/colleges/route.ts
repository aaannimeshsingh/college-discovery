import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const state = searchParams.get("state") || "";
  const sort = searchParams.get("sort") || "rating";

  const colleges = await prisma.college.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        } : {},
        type ? { type } : {},
        state ? { state } : {},
      ],
    },
    include: {
      placements: { orderBy: { year: "desc" }, take: 1 },
      _count: { select: { reviews: true } },
    },
    orderBy: sort === "fees" ? { fees: "asc" } : { rating: "desc" },
  });

  return NextResponse.json(colleges);
}
