import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ saved: false });
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId: id } },
    });
    return NextResponse.json({ saved: !!saved });
  } catch {
    return NextResponse.json({ saved: false });
  }
}

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.savedCollege.upsert({
    where: { userId_collegeId: { userId: session.user.id, collegeId: id } },
    create: { userId: session.user.id, collegeId: id },
    update: {},
  });
  return NextResponse.json({ saved: true });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.savedCollege.deleteMany({
    where: { userId: session.user.id, collegeId: id },
  });
  return NextResponse.json({ saved: false });
}
