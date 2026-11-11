"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { Logo } from "./logo";
import { useCartStore } from "@/lib/store/cart";
import { MobileNav } from "./mobile-nav";
import { CartDrawer } from "../shop/cart-drawer";
import { TryItOnButton } from "../shop/fitting-room/try-it-on-button";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.open);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-5 md:px-12">
          <Logo />

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-2 text-sm md:flex">
              <Link href="/?lang=en" className="underline underline-offset-4">
                EN
              </Link>
              <span className="text-muted">/</span>
              <Link href="/?lang=fr" className="text-muted hover:text-foreground">
                FR
              </Link>
            </nav>

            <TryItOnButton />

            <button
              type="button"
              onClick={openCart}
              aria-label="Open cart"
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />
    </>
  );
}
