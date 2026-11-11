import { Hero } from "@/components/home/hero";
import { ProductSection } from "@/components/home/product-section";
import { GalleryCoverflow } from "@/components/home/gallery-coverflow";
import { TextMarquee } from "@/components/home/text-marquee";
import { getFeaturedProducts, getNewArrivals } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
  ]);

  return (
    <>
      <Hero />
      <TextMarquee />
      <ProductSection id="products" title="All products" viewAllHref="/shop" products={featured} />
      <GalleryCoverflow />
      {/* <ProductSection title="New Arrivals" viewAllHref="/shop?sort=newest" products={newArrivals} /> */}
    </>
  );
}
