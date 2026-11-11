import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, UnauthorizedError } from "@/lib/require-admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw error;
  }

  const { id } = await params;
  const original = await prisma.product.findUnique({
    where: { id },
    include: { images: true, sizes: true, colors: true },
  });
  if (!original) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const suffix = Date.now().toString(36);
  const duplicate = await prisma.product.create({
    data: {
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${suffix}`,
      description: original.description,
      designDetails: original.designDetails,
      price: original.price,
      discountPrice: original.discountPrice,
      currency: original.currency,
      brand: original.brand,
      material: original.material,
      careInstructions: original.careInstructions,
      sku: `${original.sku}-COPY-${suffix}`,
      stockQuantity: original.stockQuantity,
      featured: false,
      newArrival: original.newArrival,
      active: false,
      categoryId: original.categoryId,
      sizes: { create: original.sizes.map((s) => ({ sizeId: s.sizeId })) },
      colors: { create: original.colors.map((c) => ({ colorId: c.colorId })) },
      images: {
        create: original.images.map((img) => ({
          url: img.url,
          publicId: img.publicId,
          position: img.position,
          alt: img.alt,
        })),
      },
    },
  });

  return NextResponse.json(duplicate, { status: 201 });
}
