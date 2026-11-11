import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { ShopFilters } from "@/types/product";

const cardSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  discountPrice: true,
  currency: true,
  stockQuantity: true,
  images: { orderBy: { position: "asc" as const }, select: { url: true, alt: true } },
} satisfies Prisma.ProductSelect;

const detailInclude = {
  images: { orderBy: { position: "asc" as const } },
  category: { select: { name: true, slug: true } },
  colors: { include: { color: true } },
  sizes: { include: { size: true }, orderBy: { size: { sortOrder: "asc" as const } } },
} satisfies Prisma.ProductInclude;

export async function getFeaturedProducts(take = 6) {
  return prisma.product.findMany({
    where: { active: true, featured: true },
    select: cardSelect,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getNewArrivals(take = 8) {
  return prisma.product.findMany({
    where: { active: true, newArrival: true },
    select: cardSelect,
    take,
    orderBy: { createdAt: "desc" },
  });
}

const PAGE_SIZE = 12;

export async function getShopProducts(filters: ShopFilters) {
  const where: Prisma.ProductWhereInput = { active: true };

  if (filters.category) {
    where.category = { slug: filters.category };
  }
  if (filters.size) {
    where.sizes = { some: { size: { label: filters.size } } };
  }
  if (filters.color) {
    where.colors = { some: { color: { name: filters.color } } };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
    };
  }
  if (filters.inStockOnly) {
    where.stockQuantity = { gt: 0 };
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (filters.sort === "price_asc") orderBy = { price: "asc" };
  if (filters.sort === "price_desc") orderBy = { price: "desc" };
  if (filters.sort === "popular") orderBy = { orderItems: { _count: "desc" } };

  const page = filters.page && filters.page > 0 ? filters.page : 1;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: cardSelect,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: detailInclude,
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null, take = 4) {
  return prisma.product.findMany({
    where: {
      active: true,
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    select: cardSelect,
    take,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllProductSlugs() {
  return prisma.product.findMany({ where: { active: true }, select: { slug: true } });
}
