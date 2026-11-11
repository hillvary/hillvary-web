import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/require-admin";

export async function GET() {
  const sizes = await prisma.size.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(sizes);
}

const schema = z.object({ label: z.string().min(1), sortOrder: z.number().int().default(0) });

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const size = await prisma.size.create({ data: parsed.data });
  return NextResponse.json(size, { status: 201 });
}
