export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  currency: string;
  stockQuantity: number;
  images: { url: string; alt: string | null }[];
}

export interface ProductDetailData extends ProductCardData {
  description: string;
  designDetails: string[];
  brand: string;
  material: string | null;
  careInstructions: string | null;
  sku: string;
  category: { name: string; slug: string } | null;
  colors: { id: string; name: string; hexCode: string }[];
  sizes: { id: string; label: string }[];
  featured: boolean;
  newArrival: boolean;
  active: boolean;
}

export interface ShopFilters {
  category?: string;
  size?: string;
  color?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  page?: number;
}
