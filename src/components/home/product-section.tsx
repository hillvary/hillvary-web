import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import { ScrollReveal } from "./scroll-reveal";
import type { ProductCardData } from "@/types/product";

export function ProductSection({
  id,
  title,
  viewAllHref,
  products,
}: {
  id?: string;
  title: string;
  viewAllHref?: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24 px-6 py-14 md:px-12">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-medium">{title}</h2>
          {viewAllHref && (
            <Link href={viewAllHref} className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <ScrollReveal key={product.id} delay={Math.min(i, 4) * 0.05}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
