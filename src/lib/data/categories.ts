import { prisma } from "@/lib/prisma";

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getSizes() {
  return prisma.size.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getColors() {
  return prisma.color.findMany({ orderBy: { name: "asc" } });
}
