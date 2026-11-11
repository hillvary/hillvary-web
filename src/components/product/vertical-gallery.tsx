"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export function VerticalGallery({
  images,
  productName,
}: {
  images: { url: string; alt: string | null }[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  function scrollTo(i: number) {
    setActive(i);
    refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (images.length === 0) {
    return <div className="aspect-[4/5] w-full rounded-3xl bg-surface" />;
  }

  return (
    <div className="flex gap-3">
      <div className="hidden flex-col gap-2 md:flex">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            className={clsx(
              "relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2",
              active === i ? "border-foreground" : "border-transparent"
            )}
          >
            <Image src={img.url} alt={img.alt ?? productName} fill className="object-cover" sizes="56px" />
          </button>
        ))}
      </div>

      <div className="max-h-[80vh] flex-1 snap-y snap-mandatory overflow-y-auto rounded-3xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="group relative mb-3 aspect-[4/5] w-full snap-start overflow-hidden rounded-3xl bg-surface last:mb-0"
          >
            <span className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center font-display text-[7rem] leading-none text-foreground/5 select-none">
              T-SHIRT
            </span>
            <Image
              src={img.url}
              alt={img.alt ?? productName}
              fill
              className="relative z-10 object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(min-width: 1024px) 45vw, 90vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
