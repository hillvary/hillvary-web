"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Shirt, Check } from "lucide-react";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import { useFittingRoom } from "@/lib/store/fitting-room";
import type { ProductCardData } from "@/types/product";

export function ProductCard({ product }: { product: ProductCardData }) {
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState(false);
  const images = product.images.length > 0 ? product.images : [{ url: "", alt: product.name }];
  const outOfStock = product.stockQuantity <= 0;

  // Fitting Room: the hanger toggles this product into the sidebar panel's
  // `picks` — see src/lib/store/fitting-room.ts for the generation flow.
  const inFittingRoom = useFittingRoom((s) => s.picks.some((p) => p.id === product.id));
  const addToFittingRoom = useFittingRoom((s) => s.addToFittingRoom);

  function next(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i + 1) % images.length);
  }
  function prev(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function handleHangerClick(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate to the product page
    e.stopPropagation();

    if (inFittingRoom) {
      setToast(true);
      window.setTimeout(() => setToast(false), 1500);
      return;
    }
    addToFittingRoom(product);
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
        {images[index]?.url ? (
          <Image
            src={images[index].url}
            alt={images[index].alt ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 90vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">No image</div>
        )}

        {outOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-xs text-background">
            Sold out
          </span>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleHangerClick}
          aria-label={inFittingRoom ? `${product.name} is in your fitting room` : `Add ${product.name} to fitting room`}
          aria-pressed={inFittingRoom}
          className={clsx(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 transition-opacity",
            // Always visible on touch/small screens; hover-revealed on desktop
            // unless already picked, in which case it stays visible as a
            // persistent "checked" indicator.
            inFittingRoom ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100",
          )}
        >
          {inFittingRoom ? <Check className="h-3.5 w-3.5" /> : <Shirt className="h-3.5 w-3.5" />}
        </button>

        {toast && (
          <span className="absolute right-2 top-11 rounded-md bg-foreground px-2 py-1 text-[10px] text-background">
            Already added
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        <span className="shrink-0 font-display text-sm text-muted-foreground">
          {formatPrice(product.discountPrice ?? product.price, product.currency)}
        </span>
      </div>
    </Link>
  );
}
