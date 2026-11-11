"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Shirt } from "lucide-react";
import clsx from "clsx";
import { useFittingRoom } from "@/lib/store/fitting-room";

export function TryItOnButton({ className }: { className?: string }) {
  const isOpen = useFittingRoom((s) => s.isOpen);
  const toggle = useFittingRoom((s) => s.toggle);
  const open = useFittingRoom((s) => s.open);
  const close = useFittingRoom((s) => s.close);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const onShopPage = pathname === "/shop";
  const active = onShopPage && isOpen;

  // Escape closes the panel and returns focus here, from anywhere on the page.
  useEffect(() => {
    if (!active) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, close]);

  function handleClick() {
    if (onShopPage) {
      toggle();
      return;
    }
    // The panel only mounts inside the /shop sidebar — jump there with it
    // already open, rather than toggling state nothing on this page can show.
    open();
    router.push("/shop");
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label="Try it on"
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-foreground hover:border-foreground",
        className,
      )}
    >
      <Shirt className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Try it on</span>
    </button>
  );
}
