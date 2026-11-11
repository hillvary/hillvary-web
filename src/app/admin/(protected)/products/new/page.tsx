import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, sizes, colors] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">New Product</h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, label: c.name }))}
        sizes={sizes.map((s) => ({ id: s.id, label: s.label }))}
        colors={colors.map((c) => ({ id: c.id, label: c.name, hexCode: c.hexCode }))}
      />
    </div>
  );
}
