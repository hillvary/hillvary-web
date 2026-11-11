"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardData } from "@/types/product";

interface RecentlyViewedState {
  items: ProductCardData[];
  addViewed: (product: ProductCardData) => void;
}

const MAX_ITEMS = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addViewed: (product) =>
        set((state) => {
          const withoutCurrent = state.items.filter((p) => p.id !== product.id);
          return { items: [product, ...withoutCurrent].slice(0, MAX_ITEMS) };
        }),
    }),
    { name: "hillvary-recently-viewed" }
  )
);
