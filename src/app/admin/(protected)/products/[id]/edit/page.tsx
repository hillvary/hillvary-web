import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories, sizes, colors] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } }, sizes: true, colors: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl">Edit Product</h1>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          designDetails: product.designDetails,
          price: product.price,
          discountPrice: product.discountPrice,
          sku: product.sku,
          material: product.material ?? "",
          careInstructions: product.careInstructions ?? "",
          stockQuantity: product.stockQuantity,
          featured: product.featured,
          newArrival: product.newArrival,
          active: product.active,
          categoryId: product.categoryId,
          sizeIds: product.sizes.map((s) => s.sizeId),
          colorIds: product.colors.map((c) => c.colorId),
          images: product.images.map((img) => ({ url: img.url, publicId: img.publicId, alt: img.alt ?? undefined })),
        }}
        categories={categories.map((c) => ({ id: c.id, label: c.name }))}
        sizes={sizes.map((s) => ({ id: s.id, label: s.label }))}
        colors={colors.map((c) => ({ id: c.id, label: c.name, hexCode: c.hexCode }))}
      />
    </div>
  );
}
