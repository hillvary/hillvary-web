import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { VerticalGallery } from "@/components/product/vertical-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { TrackRecentlyViewed, RecentlyViewedSection } from "@/components/product/recently-viewed";
import { ProductSection } from "@/components/home/product-section";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);

  const cardData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    discountPrice: product.discountPrice,
    currency: product.currency,
    stockQuantity: product.stockQuantity,
    images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
  };

  const detailData = {
    ...cardData,
    description: product.description,
    designDetails: product.designDetails,
    brand: product.brand,
    material: product.material,
    careInstructions: product.careInstructions,
    sku: product.sku,
    category: product.category,
    colors: product.colors.map((c) => c.color),
    sizes: product.sizes.map((s) => s.size),
    featured: product.featured,
    newArrival: product.newArrival,
    active: product.active,
  };

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-8 md:px-12">
      <TrackRecentlyViewed product={cardData} />

      <Link href="/shop" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.3fr_0.85fr] lg:items-start">
        <div>
          <h1 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.designDetails.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium">DESIGN:</p>
              <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted-foreground">
                {product.designDetails.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span>·</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <VerticalGallery images={detailData.images} productName={product.name} />

        <div className="lg:sticky lg:top-28">
          <PurchasePanel product={detailData} />
        </div>
      </div>

      <ProductSection title="Related Products" products={related} />
      <RecentlyViewedSection excludeId={product.id} />
    </div>
  );
}
