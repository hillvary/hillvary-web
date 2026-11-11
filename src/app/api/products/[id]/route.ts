import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { requireAdmin, UnauthorizedError } from "@/lib/require-admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, sizes: { include: { size: true } }, colors: { include: { color: true } }, category: true },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  designDetails: z.array(z.string()).optional(),
  price: z.number().int().nonnegative().optional(),
  discountPrice: z.number().int().nonnegative().nullable().optional(),
  sku: z.string().min(1).optional(),
  material: z.string().nullable().optional(),
  careInstructions: z.string().nullable().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
  featured: z.boolean().optional(),
  newArrival: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
  sizeIds: z.array(z.string()).optional(),
  colorIds: z.array(z.string()).optional(),
  images: z
    .array(z.object({ url: z.string().url(), publicId: z.string(), alt: z.string().optional() }))
    .optional(),
});

async function assertAdmin() {
  try {
    await requireAdmin();
    return null;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }
}

export async function PUT(request: Request, { params }: Params) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { sizeIds, colorIds, images, ...rest } = parsed.data;

  const data: Prisma.ProductUncheckedUpdateInput = {
    ...rest,
    ...(sizeIds
      ? { sizes: { deleteMany: {}, create: sizeIds.map((sizeId) => ({ sizeId })) } }
      : {}),
    ...(colorIds
      ? { colors: { deleteMany: {}, create: colorIds.map((colorId) => ({ colorId })) } }
      : {}),
    ...(images
      ? {
          images: {
            deleteMany: {},
            create: images.map((img, i) => ({
              url: img.url,
              publicId: img.publicId,
              alt: img.alt,
              position: i,
            })),
          },
        }
      : {}),
  };

  const product = await prisma.product.update({
    where: { id },
    data,
    include: { images: true, sizes: { include: { size: true } }, colors: { include: { color: true } } },
  });

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
