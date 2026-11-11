"use client";

import { useEffect } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed";
import type { ProductCardData } from "@/types/product";

export function TrackRecentlyViewed({ product }: { product: ProductCardData }) {
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);
  useEffect(() => {
    addViewed(product);
  }, [addViewed, product]);
  return null;
}

export function RecentlyViewedSection({ excludeId }: { excludeId: string }) {
  const items = useRecentlyViewedStore((s) => s.items).filter((p) => p.id !== excludeId);

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1800px] px-6 py-14 md:px-12">
      <h2 className="mb-6 text-base font-medium">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
