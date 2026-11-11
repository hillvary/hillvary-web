"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Heart, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { ProductDetailData } from "@/types/product";

export function PurchasePanel({ product }: { product: ProductDetailData }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [size, setSize] = useState(product.sizes[0]?.label ?? "");
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  const outOfStock = product.stockQuantity <= 0;
  const displayPrice = product.discountPrice ?? product.price;
  const image = product.images[0]?.url ?? "";

  function buildCartItem() {
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: displayPrice,
      currency: product.currency,
      image,
      color,
      size,
      quantity,
    };
  }

  function handleAddToCart() {
    if (outOfStock) return;
    addItem(buildCartItem());
  }

  function handleBuyNow() {
    if (outOfStock) return;
    addItem(buildCartItem());
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-muted-foreground">{product.category?.name ?? "Product"}</p>
        <p className="mt-1 font-display text-2xl text-muted-foreground">
          {formatPrice(displayPrice, product.currency)}
        </p>
      </div>

      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Color</p>
          <div className="flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.name)}
                aria-label={c.name}
                title={c.name}
                className={clsx(
                  "h-8 w-8 rounded-full border-2",
                  color === c.name ? "border-accent" : "border-border"
                )}
                style={{ backgroundColor: c.hexCode }}
              />
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSize(s.label)}
                className={clsx(
                  "flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm",
                  size === s.label
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1.5">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-4 text-center text-sm">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label="Toggle wishlist"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border"
        >
          <Heart className={clsx("h-4 w-4", inWishlist && "fill-accent text-accent")} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="w-full rounded-full bg-accent py-3.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {outOfStock ? "Sold Out" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={outOfStock}
          className="w-full rounded-full border border-foreground py-3.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>

      <span
        className={clsx(
          "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs",
          outOfStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        )}
      >
        <span className={clsx("h-1.5 w-1.5 rounded-full", outOfStock ? "bg-red-600" : "bg-green-600")} />
        {outOfStock ? "Out of stock" : "In stock"}
      </span>

      <dl className="grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <div>
          <dt className="font-medium text-foreground">SKU</dt>
          <dd>{product.sku}</dd>
        </div>
        {product.material && (
          <div>
            <dt className="font-medium text-foreground">Material</dt>
            <dd>{product.material}</dd>
          </div>
        )}
        {product.careInstructions && (
          <div className="col-span-2">
            <dt className="font-medium text-foreground">Care</dt>
            <dd>{product.careInstructions}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
