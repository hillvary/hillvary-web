import type { Metadata } from "next";
import { ProductCard } from "@/components/shop/product-card";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SearchBar } from "@/components/shop/search-bar";
import { SortSelect } from "@/components/shop/sort-select";
import { Pagination } from "@/components/shop/pagination";
import { getShopProducts } from "@/lib/data/products";
import { getCategories, getColors, getSizes } from "@/lib/data/categories";
import type { ShopFilters } from "@/types/product";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full Hillvary collection of faith-centered apparel.",
};

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const filters: ShopFilters = {
    category: params.category,
    size: params.size,
    color: params.color,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    inStockOnly: params.inStock === "1",
    search: params.search,
    sort: (params.sort as ShopFilters["sort"]) ?? "newest",
    page: params.page ? Number(params.page) : 1,
  };

  const [{ items, page, pageCount }, categories, sizes, colors] = await Promise.all([
    getShopProducts(filters),
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  return (
    <div className="mx-auto max-w-[1800px] px-6 py-10 md:px-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-display text-3xl tracking-tight">All Products</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:w-64">
            <SearchBar />
          </div>
          <SortSelect />
        </div>
      </div>

      <div className="flex flex-col gap-10 md:flex-row">
        <FilterSidebar categories={categories} sizes={sizes} colors={colors} />

        <div className="flex-1">
          {items.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No products match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination page={page} pageCount={pageCount} searchParams={params} />
        </div>
      </div>
    </div>
  );
}
