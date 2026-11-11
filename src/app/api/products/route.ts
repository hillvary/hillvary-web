import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getShopProducts } from "@/lib/data/products";
import { requireAdmin, UnauthorizedError } from "@/lib/require-admin";
import { slugify } from "@/lib/format";
import type { ShopFilters } from "@/types/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters: ShopFilters = {
    category: searchParams.get("category") ?? undefined,
    size: searchParams.get("size") ?? undefined,
    color: searchParams.get("color") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    inStockOnly: searchParams.get("inStock") === "1",
    search: searchParams.get("search") ?? undefined,
    sort: (searchParams.get("sort") as ShopFilters["sort"]) ?? "newest",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  };

  const result = await getShopProducts(filters);
  return NextResponse.json(result);
}

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  designDetails: z.array(z.string()).default([]),
  price: z.number().int().nonnegative(),
  discountPrice: z.number().int().nonnegative().nullable().optional(),
  sku: z.string().min(1),
  material: z.string().optional(),
  careInstructions: z.string().optional(),
  stockQuantity: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  active: z.boolean().default(true),
  categoryId: z.string().nullable().optional(),
  sizeIds: z.array(z.string()).default([]),
  colorIds: z.array(z.string()).default([]),
  images: z
    .array(z.object({ url: z.string().url(), publicId: z.string(), alt: z.string().optional() }))
    .default([]),
});

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
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = slugify(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      designDetails: data.designDetails,
      price: data.price,
      discountPrice: data.discountPrice ?? null,
      sku: data.sku,
      material: data.material,
      careInstructions: data.careInstructions,
      stockQuantity: data.stockQuantity,
      featured: data.featured,
      newArrival: data.newArrival,
      active: data.active,
      categoryId: data.categoryId ?? null,
      sizes: { create: data.sizeIds.map((sizeId) => ({ sizeId })) },
      colors: { create: data.colorIds.map((colorId) => ({ colorId })) },
      images: {
        create: data.images.map((img, i) => ({
          url: img.url,
          publicId: img.publicId,
          alt: img.alt,
          position: i,
        })),
      },
    },
    include: { images: true, sizes: true, colors: true },
  });

  return NextResponse.json(product, { status: 201 });
}
