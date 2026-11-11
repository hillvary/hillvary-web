"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { TryItOnButton } from "./fitting-room/try-it-on-button";
import { FittingRoomPanel } from "./fitting-room/fitting-room-panel";

interface FilterSidebarProps {
  categories: { name: string; slug: string }[];
  sizes: { label: string }[];
  colors: { name: string; hexCode: string }[];
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-medium"
      >
        {title}
        <ChevronDown className={clsx("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 flex flex-col gap-2">{children}</div>}
    </div>
  );
}

export function FilterSidebar({ categories, sizes, colors }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  const activeCategory = searchParams.get("category");
  const activeSize = searchParams.get("size");
  const activeColor = searchParams.get("color");
  const inStockOnly = searchParams.get("inStock") === "1";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="border-b border-border pb-4">
        <TryItOnButton />
      </div>

      <FilterGroup title="Category">
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setParam("category", c.slug)}
            className={clsx(
              "text-left text-sm",
              activeCategory === c.slug ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {c.name}
          </button>
        ))}
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setParam("size", s.label)}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs",
                activeSize === s.label
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setParam("color", c.name)}
              aria-label={c.name}
              title={c.name}
              className={clsx(
                "h-7 w-7 rounded-full border-2",
                activeColor === c.name ? "border-accent" : "border-transparent"
              )}
              style={{ backgroundColor: c.hexCode }}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price (FRW)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => setParam("minPrice", e.target.value || null)}
            className="w-full rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-foreground"
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => setParam("maxPrice", e.target.value || null)}
            className="w-full rounded-lg border border-border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-foreground"
          />
        </div>
      </FilterGroup>

      <FittingRoomPanel />

      <FilterGroup title="Availability">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={() => setParam("inStock", inStockOnly ? null : "1")}
          />
          In stock only
        </label>
      </FilterGroup>
    </aside>
  );
}
